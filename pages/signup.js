import React, { useState } from "react";

import { Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import Image from "next/image";

import { Form } from "../components/pages/patient/SignUp";
import { useBackdropLoader } from "../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../contexts/ResponseDialogContext";
import useRequest from "../hooks/useRequest";
import { createPatientAccountReq } from "../modules/firebase";
import { SignupSchema } from "../modules/validation";

const defaultValue = false
  ? {
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      birthdate: "",
      gender: "",
      address: "",
      email: "",
      password: "",
    }
  : {
      firstName: "THOMAS",
      middleName: "MICHAEL",
      lastName: "SHELBY",
      suffix: "",
      birthdate: "2022-07-05",
      gender: "male",
      address: "TEST",
      email: "test@gmail.com",
      password: "12345678",
    };

export default function SignUpPage() {
  // const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const [createPatientAccount] = useRequest(
    createPatientAccountReq,
    setBackdropLoader
  );

  const formik = useFormik({
    initialValues: defaultValue,
    validationSchema: SignupSchema,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      // alert("In Progress");
      const { error: createAccountError } = await createPatientAccount(values);
      if (createAccountError) return openErrorDialog(createAccountError);

      // Success
      openResponseDialog({
        autoClose: true,
        content: (
          <>
            <Typography variant="body1">
              Patient account registration successful.
            </Typography>
            <Typography variant="body2">For Admin approval.</Typography>
          </>
        ),
        closeCb() {
          resetForm();
        },
      });
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box sx={{ flex: 1, p: 10, mr: 6 }}>
        <Image
          src="/medical-prescription1.png"
          alt=""
          width="100%"
          height="100%"
          layout="responsive"
          objectFit="contain"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 500,
          my: 3,
        }}
      >
        <Form {...formik} />
      </Box>
    </Box>
  );
}
