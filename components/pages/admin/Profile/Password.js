import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { updateDoctorReq, updateStaffReq } from "../../../../modules/firebase";
import {
  formatTimeStamp,
  localUpdateDocs,
  personBuiltInFields,
} from "../../../../modules/helper";
import { ChangePassSchema } from "../../../../modules/validation";
import { successMessage } from "../../../common";
import { DatePicker, Input, Select } from "../../../common/Form";

const PasswordPage = ({ data, onSave }) => {
  const formik = useFormik({
    initialValues: {
      // email: data.email,
      password: "", // 12345678
      newPassword: "",
      matchPassword: "",
    },
    validationSchema: ChangePassSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Update
      const payload = {
        oldPassword: values.password,
        newPassword: values.newPassword,
      };
      onSave(payload);
    },
  });

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    submitForm,
  } = formik;
  const getError = (field) => touched?.[field] && errors?.[field];

  if (!Object.keys(values).length) return null;

  return (
    <>
      <Grid container spacing={2}>
        {/* <Grid item xs={12}>
          <Input
            required
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("email")}
          />
        </Grid> */}
        <Grid item xs={12}>
          <Input
            type="password"
            required
            label="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("password")}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            type="password"
            required
            label="New Password"
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("newPassword")}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            type="password"
            required
            label="Retype Password"
            name="matchPassword"
            value={values.matchPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("matchPassword")}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        size="small"
        onClick={submitForm}
        sx={{ mt: 3 }}
      >
        save changes
      </Button>
    </>
  );
};

export default PasswordPage;
