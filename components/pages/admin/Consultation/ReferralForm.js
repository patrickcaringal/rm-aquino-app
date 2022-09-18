import React from "react";

import { Box, Grid, Link, MenuItem } from "@mui/material";

import { formatTimeStamp } from "../../../../modules/helper";
import { DatePicker, Input } from "../../../common/Form";

const ReferralForm = ({
  values,
  touched,
  errors,
  setFieldValue,
  handleSubmit,
  handleBlur,
}) => {
  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DatePicker
            label="Date"
            value={values.date}
            onChange={(value) => {
              if (!value || value == "Invalid Date") {
                return setFieldValue("date", "", false);
              }

              setFieldValue("date", formatTimeStamp(value), false);
            }}
            onBlur={handleBlur}
            required
            error={touched.birthdate && errors.birthdate}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            multiline
            rows={4}
            value={values.address}
            required
            label="Specialist Address"
            onChange={(e) => setFieldValue("address", e.target.value)}
            onBlur={handleBlur}
            error={touched.address && errors.address}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            multiline
            rows={15}
            value={values.content}
            required
            label="Letter Content"
            onChange={(e) => setFieldValue("content", e.target.value)}
            onBlur={handleBlur}
            error={touched.content && errors.content}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReferralForm;
