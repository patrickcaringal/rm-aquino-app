import React from "react";

import { Button } from "@mui/material";
import faker from "faker";
import { FormikProvider, useFormik } from "formik";

import { isMockDataEnabled } from "../../../../modules/env";
import { DoctorSchema } from "../../../../modules/validation";
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
          services: [],
          specialty: "General Physician",
          contactNo: faker.phone.phoneNumber("09#########"),
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
          services: [],
          specialty: "",
          contactNo: "",
        },
  ],
};

export default function ManageDoctorModal({
  open = false,
  data,
  services,
  onClose,
  onSave,
}) {
  const isCreate = !data;
  const initialValues = isCreate ? defaultValues : { staffs: [data] };

  const servicesMap = services.reduce((acc, i) => {
    return { ...acc, [i.name]: i.id };
  }, {});

  const formik = useFormik({
    initialValues,
    validationSchema: DoctorSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { staffs } = values;

      const docs = staffs.map((i) => ({
        ...i,
        servicesId: i.services.map((j) => servicesMap[j]),
      }));

      onSave(docs);
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
        <Form {...formik} isCreate={isCreate} services={services} />
      </FormikProvider>
    </Modal>
  );
}
