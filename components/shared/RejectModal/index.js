import React from "react";

import { Button } from "@mui/material";
import { useFormik } from "formik";

import { PatientRejectSchema } from "../../../modules/validation";
import { Modal } from "../../common";
import { Input } from "../../common/Form";

const defaultValues = { reason: "" };

export default function ManageStaffModal({
  open = false,
  data,
  content,
  title = "Reject",
  onClose,
  onReject,
}) {
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: PatientRejectSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      onReject({ ...data, ...values });
    },
  });

  const {
    values,
    submitForm,
    resetForm,
    handleChange,
    handleBlur,
    dirty,
    errors,
    touched,
  } = formik;

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      maxWidth="sm"
      dialogActions={
        <>
          <Button
            sx={{ mr: 2 }}
            color="error"
            variant="outlined"
            disabled={!dirty}
            onClick={submitForm}
          >
            reject
          </Button>
          <Button color="inherit" onClick={handleClose}>
            Cancel
          </Button>
        </>
      }
    >
      {content}
      <Input
        value={values.reason}
        required
        label="Reason"
        name="reason"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.reason && errors.reason}
      />
    </Modal>
  );
}
