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

export default function ManageStaffModal({
  open = false,
  data,
  onClose,
  onSave,
}) {
  const isCreate = !data;
  const initialValues = isCreate ? defaultValues : { staffs: [data] };

  const formik = useFormik({
    initialValues,
    validationSchema: StaffSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { staffs } = values;
      onSave(staffs);
    },
  });

  const { values, submitForm, resetForm, dirty } = formik;

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`${isCreate ? "Add" : "Edit"} Staff`}
      dialogActions={
        <>
          <Button
            sx={{ mr: 2 }}
            disabled={values.staffs.length === 0 || !dirty}
            onClick={submitForm}
          >
            save
          </Button>
          <Button color="inherit" onClick={handleClose}>
            Cancel
          </Button>
        </>
      }
    >
      <FormikProvider value={formik}>
        <Form {...formik} isCreate={isCreate} />
      </FormikProvider>
    </Modal>
  );
}
