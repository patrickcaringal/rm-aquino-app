import React from "react";

import { Box, Button, Grid, Link } from "@mui/material";
import { useRouter } from "next/router";

import { Input } from "../../../common/Form";

const Form = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
  touched,
}) => {
  const router = useRouter();

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
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Login
      </Button>
      <Grid container>
        <Grid item xs>
          <Link href="#" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link
            href="#"
            variant="body2"
            onClick={(e) => {
              e.preventDefault();
              router.push("/signup");
            }}
          >
            Register for Account
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Form;
