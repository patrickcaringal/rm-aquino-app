import React, { useEffect, useState } from "react";

import { Box, Button, Divider, Typography } from "@mui/material";
import faker from "faker";
import { FormikProvider, useFormik } from "formik";
import lodash from "lodash";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { isMockDataEnabled } from "../../../../modules/env";
import {
  diagnosePatientReq,
  getPatientRecordReq,
} from "../../../../modules/firebase";
import { formatTimeStamp, today } from "../../../../modules/helper";
import { DiagnoseSchema } from "../../../../modules/validation";
import { Datalist, Modal, successMessage } from "../../../common";
import { Input } from "../../../common/Form";
import PatientRecord from "./PatientRecord";

const defaultValues = isMockDataEnabled
  ? {
      diagnosis: faker.lorem.paragraph(2),
    }
  : { diagnosis: "" };

const ConsultModal = ({ open = false, data, onClose }) => {
  const { openErrorDialog, openResponseDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  // const [getPatient] = useRequest(getPatientReq, setBackdropLoader);
  const [getPatientRecord] = useRequest(getPatientRecordReq, setBackdropLoader);
  const [diagnosePatient] = useRequest(diagnosePatientReq, setBackdropLoader);

  // Local States
  const [patient, setPatient] = useState({});
  const [medicalRecords, setMedicalRecords] = useState([]);

  const {
    id,
    date,
    startTime,
    endTimeEstimate,
    reasonAppointment,
    patientName,
    patientId,
  } = data;

  const appointmentData = [
    {
      label: "Patient Name",
      value: patientName,
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

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      // Get Medical Record
      const payload = { id: patientId };
      const { data, error: getError } = await getPatientRecord(payload);
      if (getError) return openErrorDialog(getError);

      setMedicalRecords(data);
    };

    // fetchPatient();
    fetchMedicalRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    onClose();
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
          <Button
            variant="contained"
            size="small"
            onClick={() => formik.submitForm()}
          >
            diagnose patient
          </Button>
          <Button color="inherit" size="small" onClick={handleClose}>
            Close
          </Button>
        </>
      }
    >
      <Box
        sx={{
          display: "grid",
          grid: "auto-flow / 552px 1fr",
          gap: 3,
        }}
      >
        <Box>
          <Box>
            <Datalist
              data={appointmentData}
              labelWidth={180}
              labelAlignment="right"
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
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
          </Box>
        </Box>
        <Box>
          <PatientRecord
            data={medicalRecords}
            // onRecordClick={handlePatientRecordModalOpen}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default ConsultModal;
