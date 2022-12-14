import React from "react";

import { Box, Button } from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";

import { formatTimeStamp } from "../../../../modules/helper";
import { Input, Modal } from "../../../common";

const MedicalCertificateModal = ({ open = false, data, onClose, onSave }) => {
  const initialValues = {
    ..._.pick(data, ["patientName", "date", "doctor", "service", "diagnosis"]),
    remarks:
      "Therefore, given the diagnosis, the patient is cleared and is fit to work",
  };

  const formik = useFormik({
    initialValues,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      onSave(values);
    },
  });
  // "remarks"

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    submitForm,
  } = formik;

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      // fullScreen
      open={open}
      onClose={handleClose}
      title="Medical Certificate"
      maxWidth="md"
      dialogActions={
        <>
          <Button color="inherit" size="small" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" size="small" onClick={submitForm}>
            print
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
        <Input
          value={formatTimeStamp(values.date, "MMMM dd, yyyy")}
          label="Date"
          name="date"
          readonly
          sx={{ mb: 2 }}
        />
        <Input
          value={values.patientName}
          label="Patient"
          name="patientName"
          readonly
          sx={{ mb: 2 }}
        />
        <Input
          value={values.doctor}
          label="Doctor"
          name="doctor"
          readonly
          sx={{ mb: 2 }}
        />
        <Input
          value={values.service}
          label="Service"
          name="service"
          readonly
          sx={{ mb: 2 }}
        />
        <Input
          value={values.diagnosis}
          label="Diagnosis"
          name="diagnosis"
          readonly
          sx={{ mb: 2 }}
        />
        <Input
          multiline
          rows={2}
          label="Other Remarks"
          name="remarks"
          placeholder="example: Given the diagnosis, we recommend the patient to have a 1 week rest. OR Patient cleared and is fit to work"
          value={values.remarks}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Box>
    </Modal>
  );
};

export default MedicalCertificateModal;
