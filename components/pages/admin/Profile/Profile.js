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
// import { UpdateProfileSchema } from "../../../../modules/validation";
import { successMessage } from "../../../common";
import { DatePicker, Input, Select } from "../../../common/Form";

const ProfilePage = ({ data, onSave }) => {
  // Requests
  // const [updateProfile] = useRequest(
  //   isDoctor ? updateDoctorReq : updateStaffReq,
  //   setBackdropLoader
  // );

  const formik = useFormik({
    initialValues: { ...data },
    // validationSchema: UpdateProfileSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      const oldCopy = [data];
      values = {
        ...values,
        birthdate: formatTimeStamp(values.birthdate),
      };

      const updatedDoc = {
        ...values,
        ...personBuiltInFields(values),
      };

      const { updates } = localUpdateDocs({
        updatedDoc,
        oldDocs: oldCopy,
      });

      onSave(updates);
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
        <Grid item xs={12} sm={3}>
          <Input
            required
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={(e) =>
              setFieldValue("firstName", e.target.value.toUpperCase())
            }
            onBlur={handleBlur}
            error={getError("firstName")}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Input
            required
            label="Middle Name"
            name="middleName"
            value={values.middleName}
            onChange={(e) =>
              setFieldValue("middleName", e.target.value.toUpperCase())
            }
            onBlur={handleBlur}
            error={getError("middleName")}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Input
            required
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={(e) =>
              setFieldValue("lastName", e.target.value.toUpperCase())
            }
            onBlur={handleBlur}
            error={getError("lastName")}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Input
            label="Suffix"
            name="suffix"
            value={values.suffix}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            value={formatTimeStamp(values.birthdate)}
            required
            label="Date of Birth"
            name="birthdate"
            onChange={(value) => {
              if (!value || value == "Invalid Date") return;
              setFieldValue("birthdate", formatTimeStamp(value), false);
            }}
            maxDate={new Date()}
            onBlur={handleBlur}
            error={getError("birthdate")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            required
            label="Gender"
            value={values.gender}
            onChange={(e) => {
              setFieldValue("gender", e.target.value, false);
            }}
            onBlur={handleBlur}
            error={getError("gender")}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <Input
            required
            label="Full Address"
            name="address"
            value={values.address}
            onChange={(e) =>
              setFieldValue("address", e.target.value.toUpperCase())
            }
            onBlur={handleBlur}
            error={getError("address")}
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

export default ProfilePage;
