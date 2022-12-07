import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Divider,
  InputAdornment,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import faker from "faker";
import { useFormik } from "formik";
import _ from "lodash";

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
import { VitalSignsSchema } from "../../../../modules/validation";
import {
  Datalist,
  Input,
  Modal,
  PdfFrame,
  Select,
  successMessage,
} from "../../../common";

const defaultValues = {
  bodyTemperature: "",
  pulseRate: "",
  bloodPressure: "",
  height: "",
  weight: "",
};

const VitalSignstModal = ({ open = false, data, onClose, onSave }) => {
  const { id: appointmentId, patientId, patientName } = data;
  const { openErrorDialog, openResponseDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getPatient] = useRequest(getPatientReq, setBackdropLoader);

  // Local States
  const [patient, setPatient] = useState({});

  useEffect(() => {
    const fetchPatient = async () => {
      const payload = { id: patientId };
      const { data, error } = await getPatient(payload);
      if (error) return openErrorDialog(error);

      setPatient(data);
    };

    fetchPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      ...defaultValues,
      ..._.pick(patient, _.keys(defaultValues)),
    },
    validationSchema: VitalSignsSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      values = _.toPairs(values).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: `${v}` }),
        {}
      );

      onSave({
        id: patientId,
        appointmentId,
        ...values,
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
    resetForm,
  } = formik;
  const getError = (field) => touched?.[field] && errors?.[field];

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Vital Signs Checking"
      maxWidth="xs"
      dialogActions={
        <>
          <Button color="inherit" size="small" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" size="small" onClick={submitForm}>
            save vital signs
          </Button>
        </>
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {patientName}
        </Typography>

        <Input
          type="number"
          value={values.bodyTemperature}
          label="Body temperature"
          name="bodyTemperature"
          onChange={handleChange}
          onBlur={handleBlur}
          error={getError("bodyTemperature")}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">°C</InputAdornment>
            ),
          }}
          placeholder="36"
        />

        <Input
          type="number"
          value={values.pulseRate}
          label="Pulse rate"
          name="pulseRate"
          onChange={handleChange}
          onBlur={handleBlur}
          error={getError("pulseRate")}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">beats per minute</InputAdornment>
            ),
          }}
          placeholder="80"
        />

        <Input
          value={values.bloodPressure}
          label="Blood pressure"
          name="bloodPressure"
          onChange={handleChange}
          onBlur={handleBlur}
          error={getError("bloodPressure")}
          sx={{ mb: 2 }}
          placeholder="120/80"
        />

        <Input
          type="number"
          value={values.height}
          label="Height"
          name="height"
          onChange={handleChange}
          onBlur={handleBlur}
          error={getError("height")}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">CM</InputAdornment>
            ),
          }}
          placeholder="178"
        />

        <Input
          type="number"
          value={values.weight}
          label="Weight"
          name="weight"
          onChange={handleChange}
          onBlur={handleBlur}
          error={getError("weight")}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">KG</InputAdornment>
            ),
          }}
          placeholder="60"
        />
      </Box>
    </Modal>
  );
};

export default VitalSignstModal;
