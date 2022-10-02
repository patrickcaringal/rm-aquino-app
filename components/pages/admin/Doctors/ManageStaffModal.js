import React from "react";

import { Box, Button } from "@mui/material";
import faker from "faker";
import { FormikProvider, useFormik } from "formik";

import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { isMockDataEnabled } from "../../../../modules/env";
import { StaffSchema } from "../../../../modules/validation";
import { Modal } from "../../../common";
import Form from "./Form";

const defaultValues = {
  staffs: [
    isMockDataEnabled
      ? {
          firstName: faker.name.firstName().toUpperCase(),
          suffix: "",
          lastName: faker.name.lastName().toUpperCase(),
          middleName: faker.name.lastName().toUpperCase(),
          email: faker.internet.email(),
          address: faker.lorem.paragraph().toUpperCase(),
          birthdate: faker.date.past(
            faker.datatype.number({
              min: 10,
              max: 50,
            })
          ),
          gender: faker.random.arrayElement(["male", "female"]),
        }
      : {
          firstName: "",
          suffix: "",
          lastName: "",
          middleName: "",
          email: "",
          address: "",
          birthdate: "",
          gender: "",
        },
  ],
};

export default function ManageDoctorModal({
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
      title={`${isCreate ? "Add" : "Edit"} Doctor`}
      dialogActions={
        <>
          <Button color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            sx={{ mr: 2 }}
            // disabled={values.staffs.length === 0 || !dirty}
            onClick={submitForm}
          >
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
