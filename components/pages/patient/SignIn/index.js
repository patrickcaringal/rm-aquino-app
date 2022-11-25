import React from "react";

import { Box } from "@mui/material";
import { useFormik } from "formik";
import Image from "next/image";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { signInPatientReq } from "../../../../modules/firebase";
import { SigninSchema } from "../../../../modules/validation";
import Form from "./Form";

const defaultValue = {
  email: "",
  password: "",
};

const PatientSignInPage = () => {
  const { manualSetUser } = useAuth();
  const { openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  const [signIn] = useRequest(signInPatientReq, setBackdropLoader);

  const formik = useFormik({
    initialValues: defaultValue,
    validationSchema: SigninSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { email, password } = values;

      // Authenticate
      const { data: userInfo, error: signInError } = await signIn({
        email,
        password,
      });
      if (signInError) return openErrorDialog(signInError);

      manualSetUser(userInfo);
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
          justifyContent: "center",
          width: 500,
          my: 3,
          mb: 10,
        }}
      >
        <Form {...formik} />
      </Box>
    </Box>
  );
};

export default PatientSignInPage;
