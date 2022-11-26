import React from "react";

import { Button, Typography } from "@mui/material";
import { useFormik } from "formik";

import { ForgotPassSchema } from "../../../modules/validation";
import { Modal } from "../../common";
import { Input } from "../../common/Form";

const defaultValues = { email: "" };

export default function ForgotPasswordModal({
  open = false,
  onClose,
  onSubmit,
}) {
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: ForgotPassSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      resetForm();
      onSubmit(values);
    },
  });

  const {
    values,
    submitForm,
    resetForm,
    handleChange,
    handleBlur,
    errors,
    touched,
  } = formik;

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Forgot Password"
      maxWidth="sm"
      dialogActions={
        <>
          <Button color="inherit" size="small" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            sx={{ mr: 2 }}
            color="success"
            variant="contained"
            size="small"
            onClick={submitForm}
          >
            send
          </Button>
        </>
      }
    >
      <Typography sx={{ mb: 2 }}>
        Enter your email to receive an email to reset your password.
      </Typography>
      <Input
        value={values.email}
        required
        label="Email"
        name="email"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && errors.email}
      />
    </Modal>
  );
}
