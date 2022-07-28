import React from "react";

import { Box, Button } from "@mui/material";
import { FormikProvider, useFormik } from "formik";

import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { StaffSchema } from "../../../../modules/validation";
import { Modal } from "../../../common";
import Form from "./Form";

const defaultValues = {
  staffs: [],
};

export default function ManageStaffModal({ open, onClose, onSave }) {
  const { openResponseDialog } = useResponseDialog();

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: StaffSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { staffs } = values;
      onSave(staffs);
    },
  });

  const { values, submitForm, resetForm } = formik;

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Staff"
      dialogActions={
        <>
          <Button
            sx={{ mr: 2 }}
            disabled={values.staffs.length === 0}
            onClick={submitForm}
          >
            saves
          </Button>
          <Button color="inherit" onClick={handleClose}>
            Cancel
          </Button>
        </>
      }
    >
      <FormikProvider value={formik}>
        <Form {...formik} />
      </FormikProvider>
    </Modal>
  );
}
