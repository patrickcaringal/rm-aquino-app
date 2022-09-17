import React, { useEffect, useState } from "react";

import { Box, Button, Divider, MenuItem } from "@mui/material";
import axios from "axios";
import faker from "faker";
import { useFormik } from "formik";
import lodash from "lodash";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { getBaseApi, isMockDataEnabled } from "../../../../modules/env";
import {
  SERVICE_TYPE,
  diagnosePatientReq,
  getPatientRecordReq,
  getPatientReq,
} from "../../../../modules/firebase";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";
import { DiagnoseSchema, ReferSchema } from "../../../../modules/validation";
import { Datalist, Modal, PdfFrame, successMessage } from "../../../common";
import { Input, Select } from "../../../common/Form";
import PatientRecord from "./PatientRecord";
import ReferralForm from "./ReferralForm";

const defaultValues = isMockDataEnabled
  ? {
      diagnosis: faker.lorem.sentences(1),
    }
  : { diagnosis: "" };

const specialistName = `Dr.${faker.name.firstName()} ${faker.name.lastName()}`;

const referralDefaultValue = isMockDataEnabled
  ? {
      date: formatTimeStamp(new Date()),
      address: `${specialistName}\n${faker.lorem.words(3)}\n${faker.lorem.words(
        3
      )}`,
      content: `${specialistName},\n\n${faker.lorem.paragraphs(2)}`,
    }
  : {
      date: "",
      address: "",
      content: "",
    };

const ConsultModal = ({ open = false, data, onClose, setAppointments }) => {
  const { openErrorDialog, openResponseDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getPatient] = useRequest(getPatientReq, setBackdropLoader);
  const [getPatientRecord] = useRequest(getPatientRecordReq, setBackdropLoader);
  const [diagnosePatient] = useRequest(diagnosePatientReq, setBackdropLoader);
  const [generateReferral] = useRequest(axios.post, setBackdropLoader);

  // Local States
  const [patient, setPatient] = useState({});
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [serviceType, setServiceType] = useState(SERVICE_TYPE.DIAGNOSE);
  const [pdfFile, setPdfFile] = useState(null);

  const {
    id,
    date,
    startTime,
    endTimeEstimate,
    reasonAppointment,
    patientName,
    patientId,
  } = data;

  const { birthdate, gender } = patient;

  const appointmentData = [
    {
      label: "Patient Name",
      value: patientName,
    },
    {
      label: "Age",
      value: birthdate ? calculateAge(formatTimeStamp(birthdate)) : "-",
    },
    {
      label: "Birthdate",
      value: birthdate ? formatTimeStamp(birthdate, "MMM-dd-yyyy") : "-",
    },
    {
      label: "Gender",
      value: gender ? gender : "-",
    },
    {
      label: "Appointment Date",
      value: formatTimeStamp(date, "MMM dd, yyyy"),
    },
    {
      label: "Appointment Day",
      value: formatTimeStamp(date, "EEEE"),
    },
    {
      label: "Appointment Time",
      value: `${startTime} - ${endTimeEstimate}`,
    },
    {
      label: "Reason for Appointment",
      value: reasonAppointment,
    },
  ];

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: DiagnoseSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        document: {
          diagnosis: values.diagnosis,
          service: SERVICE_TYPE.DIAGNOSE,
          ...lodash.pick(data, [
            "patientName",
            "patientId",
            "patientEmail",
            "reasonAppointment",
            "date",
            "startTime",
            "endTimeEstimate",
            "weekNo",
          ]),
          appointmentId: id,
        },
      };

      const { error: diganoseError } = await diagnosePatient(payload);
      if (diganoseError) return openErrorDialog(diganoseError);

      // Successful
      setAppointments((prev) => prev.filter((i) => i.id !== id));
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

  const referralFormik = useFormik({
    initialValues: referralDefaultValue,
    validationSchema: ReferSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        date: formatTimeStamp(values.date, "MMMM dd, yyyy"),
        // referrer: "Dr. RM Aquino",
      };

      try {
        const res = await generateReferral(getBaseApi("/pdf"), payload);
        setPdfFile(res?.data);
      } catch (error) {
        setBackdropLoader(false);
        openErrorDialog(error?.message);
      }
    },
  });

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

    fetchPatient();
    fetchMedicalRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleServiceChange = (e) => {
    setServiceType(e.target.value);
    setPdfFile(null);
  };

  const handleSaveReferral = async () => {
    const payload = {
      document: {
        referral: referralFormik.values,
        service: SERVICE_TYPE.REFER,
        ...lodash.pick(data, [
          "patientName",
          "patientId",
          "patientEmail",
          "reasonAppointment",
          "date",
          "startTime",
          "endTimeEstimate",
          "weekNo",
        ]),
        appointmentId: id,
        diagnosis: "",
      },
    };

    const { error: diganoseError } = await diagnosePatient(payload);
    if (diganoseError) return openErrorDialog(diganoseError);

    // Successful
    setAppointments((prev) => prev.filter((i) => i.id !== id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Referral",
        verb: "saved",
      }),
      type: "SUCCESS",
      closeCb() {
        handleClose();
        referralFormik.resetForm();
      },
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Doctor Consultation"
      maxWidth="xl"
      // maxWidth="100%"
      dialogActions={
        <>
          {serviceType === SERVICE_TYPE.DIAGNOSE && (
            <Button
              variant="contained"
              size="small"
              onClick={() => formik.submitForm()}
            >
              save diagnosis
            </Button>
          )}
          {serviceType === SERVICE_TYPE.REFER && (
            <>
              {!pdfFile ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => referralFormik.submitForm()}
                >
                  generate referral
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveReferral}
                >
                  save referral
                </Button>
              )}
            </>
          )}
          <Button color="inherit" size="small" onClick={handleClose}>
            Close
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
            <Select
              required
              label="Service"
              onChange={handleServiceChange}
              value={serviceType}
              sx={{ mb: 2 }}
            >
              <MenuItem value={SERVICE_TYPE.DIAGNOSE}>Diagnose</MenuItem>
              <MenuItem value={SERVICE_TYPE.REFER}>Referral</MenuItem>
            </Select>
            {serviceType === SERVICE_TYPE.DIAGNOSE && (
              <Input
                multiline
                rows={3}
                required
                label="Doctor Diagnosis"
                name="diagnosis"
                value={formik.values.diagnosis}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.diagnosis && formik.errors.diagnosis}
              />
            )}
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />
        {/* Patient Record */}
        <Box sx={{ pl: 3, flex: 1 }}>
          {serviceType === SERVICE_TYPE.DIAGNOSE ? (
            <PatientRecord data={medicalRecords} />
          ) : (
            <>
              {!pdfFile ? (
                <ReferralForm onSave={() => {}} {...referralFormik} />
              ) : (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setPdfFile(null)}
                    sx={{ mb: 1 }}
                  >
                    back to form
                  </Button>
                  <PdfFrame src={`${pdfFile}`} width="100%" height="600" />
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ConsultModal;
