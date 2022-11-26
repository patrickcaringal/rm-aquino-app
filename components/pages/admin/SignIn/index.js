import React, { useState } from "react";

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

import { ForgotPasswordModal } from "../../../../components/shared";
import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { isMockDataEnabled } from "../../../../modules/env";
import {
  forgotPasswordReq,
  signInAdminReq,
} from "../../../../modules/firebase";
import { DoctorSigninSchema } from "../../../../modules/validation";
import Form from "./Form";

const defaultValues = isMockDataEnabled
  ? {
      email: "rmaquino@gmail.com",
      password: "12345678",
    }
  : {
      email: "",
      password: "",
    };

const defaultModal = {
  open: false,
  data: {},
};

const AdminSignInPage = () => {
  const { manualSetUser } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [signIn] = useRequest(signInAdminReq, setBackdropLoader);
  const [forgotPatientPassword] = useRequest(
    forgotPasswordReq,
    setBackdropLoader
  );

  // Local States
  const [forgotPassModal, setForgotPassModal] = useState(defaultModal);

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

  const handleForgotPasswordModalOpen = () => {
    setForgotPassModal({
      open: true,
      data: {},
    });
  };

  const handleForgotPassword = async (v) => {
    const payload = { email: v.email };
    const { error } = await forgotPatientPassword(payload);
    if (error) return openErrorDialog(error);

    openResponseDialog({
      title: "Forgot Password",
      type: "CONFIRM",
      autoClose: true,
      content: `An email to reset your password is sent to ${v.email}.`,
      closeCb() {
        setForgotPassModal(defaultModal);
      },
    });
  };

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
        <Form
          {...formik}
          onForgotPasswordModalOpen={handleForgotPasswordModalOpen}
        />
      </Box>

      <ForgotPasswordModal
        open={forgotPassModal.open}
        onSubmit={handleForgotPassword}
        onClose={() => setForgotPassModal(defaultModal)}
      />
    </Box>
  );
};

export default AdminSignInPage;
