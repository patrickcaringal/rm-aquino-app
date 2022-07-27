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

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { signInAdminReq } from "../../../../modules/firebase";
import { DoctorSigninSchema } from "../../../../modules/validation";
import Form from "./Form";

const defaultValues = false
  ? {
      email: "",
      password: "",
    }
  : {
      email: "rmaquino@gmail.com",
      password: "12345678",
    };

const AdminSignInPage = () => {
  const { manualSetUser } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();

  // Requests
  const [signIn] = useRequest(signInAdminReq, setBackdropLoader);

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: DoctorSigninSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { email, password } = values;

      // Authenticate
      const { data: userInfo, error: authError } = await signIn({
        email,
        password,
      });
      if (authError) return openErrorDialog(authError);

      manualSetUser(userInfo);
    },
  });
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
      }}
    >
      <Box sx={{ flex: 1, p: 10, mr: 6 }}>
        <Image
          src="/admins.png"
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

export default AdminSignInPage;
