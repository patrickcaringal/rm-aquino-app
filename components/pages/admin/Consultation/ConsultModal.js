import React, { useEffect, useState } from "react";

import { Autocomplete, Box, Button, Divider, Typography } from "@mui/material";
import faker from "faker";
import { useFormik } from "formik";
import lodash from "lodash";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { isMockDataEnabled } from "../../../../modules/env";
import {
  SERVICE_TYPE,
  diagnosePatientReq,
  getDiagnosisReq,
  getPatientRecordReq,
  getPatientReq,
} from "../../../../modules/firebase";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";
import { DiagnoseSchema } from "../../../../modules/validation";
import { Datalist, Modal, successMessage } from "../../../common";
import { Input } from "../../../common/Form";
import MedicationTable from "./MedicationTable";
import PatientRecord from "./PatientRecord";

const defaultValues = isMockDataEnabled
  ? {
      diagnosis: "",
      diagnosisId: "",
      otherDiagnosis: "",
      remarks: "",
      medications: [
        {
          name: faker.lorem.words(1),
          dosage: "mg",
          frequency: "2 times a day",
          quantity: "0",
          remarks: faker.lorem.words(4),
        },
      ],
    }
  : {
      diagnosis: "",
      diagnosisId: "",
      otherDiagnosis: "",
      remarks: "",
      medications: [
        {
          name: "",
          dosage: "",
          frequency: "",
          quantity: "0",
          remarks: "",
        },
      ],
    };

const ConsultModal = ({ open = false, data, onClose, onSave }) => {
  const { openErrorDialog, openResponseDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getPatient] = useRequest(getPatientReq, setBackdropLoader);
  const [getPatientRecord] = useRequest(getPatientRecordReq, setBackdropLoader);
  const [diagnosePatient] = useRequest(diagnosePatientReq, setBackdropLoader);
  const [getDiagnosis] = useRequest(getDiagnosisReq, setBackdropLoader);

  // Local States
  const [patient, setPatient] = useState({});
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [serviceType, setServiceType] = useState(SERVICE_TYPE.DIAGNOSE);
  const [displayMedicalRecords, setDisplayMedicalRecords] = useState(false);

  const {
    id,
    date,
    startTime,
    endTimeEstimate,
    patientName,
    patientId,
    service,
    // vitals
    bodyTemperature,
    pulseRate,
    bloodPressure,
    height,
    weight,
  } = data;

  const { birthdate, gender } = patient;

  const appointmentData = [
    {
      label: "Appointment Date",
      value: formatTimeStamp(date, "MMM dd, yyyy (EEEE)"),
    },
    {
      label: "Appointment Time",
      value: `${startTime} - ${endTimeEstimate}`,
    },
    {
      label: "Service",
      value: `${service}`,
    },
    {
      label: "Patient Name",
      value: patientName,
    },
    {
      label: "Age",
      value: birthdate ? calculateAge(formatTimeStamp(birthdate)) : "-",
    },
    {
      label: "Gender",
      value: gender ? gender : "-",
    },
    {
      label: "Body Temperature",
      value: bodyTemperature ? `${bodyTemperature} °C` : "-",
    },
    {
      label: "Pulse Rate",
      value: pulseRate ? `${pulseRate} beats per minute` : "-",
    },
    {
      label: "Blood Pressure",
      value: bloodPressure ? bloodPressure : "-",
    },
    {
      label: "Height",
      value: height ? `${height} cm` : "-",
    },
    {
      label: "Weight",
      value: weight ? `${weight} kg` : "-",
    },
  ];

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: DiagnoseSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (values.medications.length < 1)
        return openErrorDialog("Medication is required.");

      const p = {
        ...values,
        diagnosis:
          values.diagnosis === "Others"
            ? values.otherDiagnosis
            : values.diagnosis,
      };
      delete p.otherDiagnosis;

      const payload = {
        document: {
          ...p,
          ...lodash.pick(data, [
            "patientName",
            "patientId",
            "patientEmail",
            "service",
            "serviceId",
            "doctor",
            "doctorId",
            "date",
            "startTime",
            "endTimeEstimate",
            "weekNo",
            "month",
            // vitals
            "bodyTemperature",
            "pulseRate",
            "bloodPressure",
            "height",
            "weight",
          ]),
          appointmentId: id,
        },
      };

      const { error } = await diagnosePatient(payload);
      if (error) return openErrorDialog(error);

      // Successful
      // setAppointments((prev) => prev.filter((i) => i.id !== id));
      onSave();
      openResponseDialog({
        autoClose: true,
        content: successMessage({
          noun: "Diagnosis",
          verb: "saved",
        }),
        type: "SUCCESS",
        closeCb() {
          handleClose();
          resetForm();
          // setTimeout(() => {}, 750);
        },
      });
    },
  });

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    submitForm,
  } = formik;

  const getError = (field) => touched?.[field] && errors?.[field];

  useEffect(() => {
    const fetchPatient = async () => {
      // Get Patient
      const payload = { id: patientId };
      const { data, error: getError } = await getPatient(payload);
      if (getError) return openErrorDialog(getError);

      setPatient(data);
    };

    const fetchMedicalRecord = async () => {
      // Get Medical Record
      const payload = { id: patientId };
      const { data, error: getError } = await getPatientRecord(payload);
      if (getError) return openErrorDialog(getError);

      setMedicalRecords(data);
    };

    const fetchDiagnosis = async () => {
      const { data, error } = await getDiagnosis();
      if (error) return openErrorDialog(error);

      const d = data.map((i) => ({ ...i, label: i.name }));
      d.push({ label: "Others", id: "", name: "Others" });
      setDiagnosis(d);
    };

    fetchPatient();
    fetchMedicalRecord();
    fetchDiagnosis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      fullScreen
      open={open}
      onClose={handleClose}
      title="Doctor Consultation"
      maxWidth="xl"
      // maxWidth="100%"
      dialogActions={
        <>
          <Button color="inherit" size="small" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" size="small" onClick={submitForm}>
            save diagnosis
          </Button>
        </>
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Patient Details */}
        <Box>
          <Box sx={{ pr: 3, width: 506 }}>
            <Datalist
              data={appointmentData}
              labelWidth={180}
              labelAlignment="right"
            />
          </Box>

          <Divider sx={{ my: 3 }} />
          <Box sx={{ pr: 3 }}>
            {!displayMedicalRecords && (
              <Button
                variant="contained"
                size="small"
                onClick={() => setDisplayMedicalRecords(true)}
                sx={{ mb: 2 }}
              >
                view past medical records
              </Button>
            )}

            <Autocomplete
              value={values.diagnosis}
              disablePortal
              options={diagnosis}
              onChange={(event, newValue) => {
                setFieldValue("diagnosisId", newValue?.id);
                setFieldValue("diagnosis", newValue?.name);
              }}
              onBlur={handleBlur}
              renderInput={(params) => (
                <Input
                  {...params}
                  required
                  label="Diagnosis"
                  placeholder="Select Diagnosis"
                  name="diagnosis"
                  error={getError("diagnosis")}
                />
              )}
              sx={{ mb: 2 }}
            />
            {values.diagnosis === "Others" && (
              <Input
                value={values.otherDiagnosis}
                label="Other Diagnosis"
                name="otherDiagnosis"
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mb: 2 }}
                error={getError("otherDiagnosis")}
              />
            )}

            <Input
              multiline
              rows={2}
              label="Remarks"
              name="remarks"
              value={values.remarks}
              onChange={handleChange}
              onBlur={handleBlur}
              // error={formik.touched.diagnosis && formik.errors.diagnosis}
            />
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />
        {/* Patient Record */}
        <Box sx={{ pl: 3, flex: 1 }}>
          {!displayMedicalRecords && <MedicationTable formik={formik} />}
          {displayMedicalRecords && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="body1" fontWeight="500">
                  Past Medical Records
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setDisplayMedicalRecords(false)}
                >
                  back to medication
                </Button>
              </Box>
              <PatientRecord data={medicalRecords} />
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ConsultModal;
