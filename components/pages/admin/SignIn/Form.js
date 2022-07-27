import React from "react";

import { LoadingButton } from "@mui/lab";
import { Box, Grid, Link } from "@mui/material";
import { useRouter } from "next/router";

import { Input } from "../../../common/Form";

const Form = ({
  handleSubmit,
  handleChange,
  handleBlur,
  setFieldValue,
  values,
  errors,
  touched,
}) => {
  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            value={values.email}
            required
            label="Email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            type="password"
            value={values.password}
            required
            label="Password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
          />
        </Grid>
      </Grid>
      <LoadingButton
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Login
      </LoadingButton>
      <Grid container>
        <Grid item xs>
          <Link href="#" variant="body2">
            Forgot password?
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Form;
