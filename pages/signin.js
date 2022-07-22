import React from "react";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";

import { Form } from "../components/pages/patient/SignIn";
import { useAuth } from "../contexts/AuthContext";
import { useResponseDialog } from "../contexts/ResponseDialogContext";
import useRequest from "../hooks/useRequest";
import {
  checkAccountCredentialReq,
  signInAnonymouslyReq,
} from "../modules/firebase";
import { SigninSchema } from "../modules/validation";

const defaultValue = {
  contactNo: "",
  password: "",
};

export default function SignInPage() {
  const router = useRouter();
  const { manualSetUser } = useAuth();
  const { openErrorDialog } = useResponseDialog();
  const [checkAccountCredential, checkAccountCredentialLoading] = useRequest(
    checkAccountCredentialReq
  );
  const [signInAnonymously, signInAnonymouslyLoading] =
    useRequest(signInAnonymouslyReq);
  const isSignInLoading =
    checkAccountCredentialLoading || signInAnonymouslyLoading;

  const formik = useFormik({
    initialValues: defaultValue,
    validationSchema: SigninSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      // const { contactNo, password } = values;
      // // Authenticate
      // const { data: userInfo, error: authError } = await checkAccountCredential(
      //   {
      //     contactNo,
      //     password,
      //   }
      // );
      // if (authError) return openErrorDialog(authError);
      // // Sign In Anonymously
      // const { error: signInError } = await signInAnonymously();
      // if (signInError) return openErrorDialog(signInError);
      // manualSetUser(userInfo);
    },
  });
  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formik;

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
}
