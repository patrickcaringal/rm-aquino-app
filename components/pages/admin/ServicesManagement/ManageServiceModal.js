import React, { useEffect } from "react";

import { Button } from "@mui/material";
import { FormikProvider, useFormik } from "formik";

import { ServicesSchema } from "../../../../modules/validation";
import { Modal } from "../../../common";
import Form from "./Form";

const defaultValues = {
  services: [
    {
      name: "",
      description: "",
      price: 0,
    },
  ],
};

export default function ManageServiceModal({
  open = false,
  data,
  onClose,
  onSave,
}) {
  const isCreate = !data;
  const initialValues = isCreate ? defaultValues : { services: [data] };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: ServicesSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { services } = values;
      onSave(services);
    },
  });

  const { submitForm, resetForm } = formik;

  useEffect(() => {
    if (!open) resetForm();
  }, [open, resetForm]);

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`${isCreate ? "Add" : "Edit"} Service`}
      dialogActions={
        <>
          <Button color="inherit" onClick={handleClose}>
            cancel
          </Button>
          <Button color="inherit" sx={{ mr: 2 }} onClick={submitForm}>
            save
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
