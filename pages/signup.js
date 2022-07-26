import React, { useState } from "react";

import { Box } from "@mui/material";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";

import { Form } from "../components/pages/patient/SignUp";
import { useResponseDialog } from "../contexts/ResponseDialogContext";
import useRequest from "../hooks/useRequest";
import { checkAccountDuplicateReq } from "../modules/firebase";
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

// {
//   firstName: "",
//   middleName: "",
//   lastName: "",
//   suffix: "",
//   birthdate: "",
//   gender: "",
//   address: "",
//   email: "",
//   password: "",
// }

export default function SignUpPage() {
  // const router = useRouter();
  // const { openErrorDialog } = useResponseDialog();
  // const [checkAccountDuplicate, checkAccountDuplicateLoading] = useRequest(
  //   checkAccountDuplicateReq
  // );

  const formik = useFormik({
    initialValues: defaultValue,
    validationSchema: SignupSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      // alert("In Progress");
      console.log(JSON.stringify(values, null, 4));
      // // Check Account Duplicate
      // const { error: checkAccDupliError } = await checkAccountDuplicate(
      //   values.email
      // );
      // if (checkAccDupliError) return openErrorDialog(checkAccDupliError);
      // // Move to contact no verification
      // setStep(STEPS.VERIFICATION);
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
