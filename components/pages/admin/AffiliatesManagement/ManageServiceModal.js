import React, { useEffect } from "react";

import { Button } from "@mui/material";
import faker from "faker";
import { FormikProvider, useFormik } from "formik";

import { isMockDataEnabled } from "../../../../modules/env";
import { AffiliatesSchema } from "../../../../modules/validation";
import { Modal } from "../../../common";
import Form from "./Form";

const defaultValues = {
  affiliates: [
    isMockDataEnabled
      ? {
          name: `${faker.name.firstName().toUpperCase()} CLINIC`,
          address: faker.lorem.paragraph().toUpperCase(),
          email: faker.internet.email(),
        }
      : {
          name: "",
          address: "",
          email: "",
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
  const initialValues = isCreate ? defaultValues : { affiliates: [data] };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: AffiliatesSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      let { affiliates } = values;
      affiliates = affiliates.map((i) => ({
        ...i,
        name: i.name.toUpperCase(),
        address: i.address.toUpperCase(),
      }));

      onSave(affiliates);
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
      title={`${isCreate ? "Add" : "Edit"} Affiliate`}
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
