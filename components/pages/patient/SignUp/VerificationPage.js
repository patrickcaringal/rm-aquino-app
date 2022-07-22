import React from "react";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";

import { useAuth } from "../../../../contexts/AuthContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  createAccountReq,
  signInAnonymouslyReq,
} from "../../../../modules/firebase";
import { VerificationCodeSchema } from "../../../../modules/validation";

const VerificationPage = ({ values: formValues }) => {
  const { manualSetUser } = useAuth();
  const { openErrorDialog } = useResponseDialog();
  const [createAccount, createAccountLoading] = useRequest(createAccountReq);
  const [signInAnonymously, signInAnonymouslyLoading] =
    useRequest(signInAnonymouslyReq);
  const isSignUpLoading = createAccountLoading || signInAnonymouslyLoading;

  const formik = useFormik({
    initialValues: {
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
    },
    validationSchema: VerificationCodeSchema,
    validateOnChange: false,
    onSubmit: async (verificationCodes) => {
      const { digit1, digit2, digit3, digit4 } = verificationCodes;
      const finalCode = `${digit1}${digit2}${digit3}${digit4}`;

      // TODO: Verify code legit
      if (finalCode === "1234") {
        // Create User Doc
        const { data: userInfo, error: createAccError } = await createAccount(
          formValues
        );
        if (createAccError) return openErrorDialog(createAccError);

        const { error: signInError } = await signInAnonymously();
        if (signInError) return openErrorDialog(signInError);

        manualSetUser(userInfo);
      } else {
        openErrorDialog("Incorrect Verification code");
      }
    },
  });
  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formik;
  const hasFormError =
    Object.keys(errors).length > 0 && Object.keys(touched).length === 4;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Contact Number Verification
      </Typography>
      <Typography variant="body1">
        Verification code sent to {formValues.contactNo}
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Grid item xs={4}>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              name="digit1"
              autoComplete="off"
              value={values.digit1}
              onChange={handleChange}
              onBlur={handleBlur}
              error={hasFormError}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              name="digit2"
              autoComplete="off"
              value={values.digit2}
              onChange={handleChange}
              onBlur={handleBlur}
              error={hasFormError}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              name="digit3"
              autoComplete="off"
              value={values.digit3}
              onChange={handleChange}
              onBlur={handleBlur}
              error={hasFormError}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              name="digit4"
              autoComplete="off"
              value={values.digit4}
              onChange={handleChange}
              onBlur={handleBlur}
              error={hasFormError}
            />
          </Grid>
        </Box>

        {hasFormError && (
          <FormHelperText error sx={{ mt: 2 }}>
            Complete the verification code
          </FormHelperText>
        )}

        <LoadingButton
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          loading={isSignUpLoading}
        >
          Verify
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default VerificationPage;
