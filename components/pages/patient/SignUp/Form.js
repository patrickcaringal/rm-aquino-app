import React from "react";

import { LoadingButton } from "@mui/lab";
import { Box, FormHelperText, Grid, Link } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useRouter } from "next/router";

import { DatePicker, Input } from "../../../common/Form";

const Form = ({
  handleSubmit,
  handleChange,
  handleBlur,
  setFieldValue,
  values,
  errors,
  touched,
}) => {
  const router = useRouter();

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            value={values.firstName}
            required
            label="First Name"
            name="firstName"
            onChange={(e) =>
              setFieldValue("firstName", e.target.value.toUpperCase())
            }
            onBlur={handleBlur}
            error={touched.firstName && errors.firstName}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            value={values.middleName}
            required
            label="Middle Name"
            name="middleName"
            onChange={(e) =>
              setFieldValue("middleName", e.target.value.toUpperCase())
            }
            onBlur={handleBlur}
            error={touched.middleName && errors.middleName}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Input
            value={values.lastName}
            required
            label="Last Name"
            name="lastName"
            onChange={(e) =>
              setFieldValue("lastName", e.target.value.toUpperCase())
            }
            onBlur={handleBlur}
            error={touched.lastName && errors.lastName}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Input
            value={values.suffix}
            label="Suffix"
            name="suffix"
            onChange={(e) =>
              setFieldValue("suffix", e.target.value.toUpperCase())
            }
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            label="Date of Birth"
            value={values.birthdate}
            onChange={(value) => {
              setFieldValue("birthdate", value, false);
            }}
            onBlur={handleBlur}
            required
            name="birthdate"
            error={touched.birthdate && errors.birthdate}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl
            variant="filled"
            focused
            fullWidth
            size="small"
            required
            error={touched.gender && errors.gender}
          >
            <InputLabel>Gender</InputLabel>
            <Select
              value={values.gender}
              label="Gender"
              onChange={(e) => {
                setFieldValue("gender", e.target.value, false);
              }}
              onBlur={handleBlur}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
            {touched.gender && errors.gender && (
              <FormHelperText>{errors.gender}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Input
            multiline
            rows={2}
            value={values.address}
            required
            label="Full Address"
            name="address"
            onChange={(e) =>
              setFieldValue("address", e.target.value.toUpperCase())
            }
            onBlur={handleBlur}
            error={touched.address && errors.address}
          />
        </Grid>

        {/* CREDENTIAL */}
        <Grid item xs={12}>
          <Input
            value={values.contactNo}
            required
            label="Email"
            name="contactNo"
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.contactNo && errors.contactNo}
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
        Register
      </LoadingButton>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link
            href="#"
            variant="body2"
            onClick={(e) => {
              e.preventDefault();
              router.push("/signin");
            }}
          >
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Form;
