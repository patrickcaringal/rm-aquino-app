import React from "react";

import { Box, Button } from "@mui/material";
import { useFormik } from "formik";

import { Modal } from "../../../common";
import MedicationTable from "./MedicationTable";

const PrescriptionModal = ({ open = false, data, onClose, onSave }) => {
  const formik = useFormik({
    initialValues: { medications: data?.medications || [] },
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      onSave(values);
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

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      // fullScreen
      open={open}
      onClose={handleClose}
      title="Prescription"
      maxWidth="md"
      dialogActions={
        <>
          <Button color="inherit" size="small" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" size="small" onClick={submitForm}>
            print prescription
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
        <MedicationTable formik={formik} />
      </Box>
    </Modal>
  );
};

export default PrescriptionModal;
