import React, { useEffect } from "react";

import { Button } from "@mui/material";
import faker from "faker";
import { FormikProvider, useFormik } from "formik";

import { isMockDataEnabled } from "../../../../modules/env";
import { AffiliatesSchema } from "../../../../modules/validation";
import { Modal } from "../../../common";
import Form from "./Form";

const defaultValues = {
  diagnosis: [
    isMockDataEnabled
      ? {
          name: faker.lorem.words(1).toUpperCase(),
          description: faker.lorem.paragraph().toUpperCase(),
        }
      : {
          name: "",
          description: "",
        },
  ],
};

export default function ManageAffiliateModal({
  open = false,
  data,
  onClose,
  onSave,
}) {
  const isCreate = !data;
  const initialValues = isCreate ? defaultValues : { diagnosis: [data] };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: AffiliatesSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      let { diagnosis } = values;
      diagnosis = diagnosis.map((i) => ({
        ...i,
        name: i.name.toUpperCase(),
        description: i.description.toUpperCase(),
      }));

      onSave(diagnosis);
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
      title={`${isCreate ? "Add" : "Edit"} Diagnosis`}
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
