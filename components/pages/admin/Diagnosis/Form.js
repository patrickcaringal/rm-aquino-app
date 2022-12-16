import React from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Divider, Fab, Grid, IconButton } from "@mui/material";
import faker from "faker";
import { FieldArray } from "formik";

import { isMockDataEnabled } from "../../../../modules/env";
import { Input } from "../../../common/Form";

const defaultItem = {
  name: "",
  description: "",
};

const Form = ({
  isCreate,
  // formik
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  isCreate = false;

  return (
    <FieldArray
      name="diagnosis"
      render={({ push, remove }) => {
        return (
          <>
            {isCreate && (
              <Fab
                color="primary"
                variant="extended"
                sx={{ position: "absolute", bottom: 8, left: 16 }}
                onClick={() => {
                  push(
                    isMockDataEnabled
                      ? {
                          name: faker.lorem.words(),
                          description: faker.lorem.paragraph(),
                        }
                      : defaultItem
                  );
                }}
                size="small"
              >
                <AddIcon />
                Add Service
              </Fab>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                overflow: "overlay",
                minHeight: isCreate ? 280 : 0,
              }}
            >
              {values.diagnosis.map((s, index) => {
                const valueArr = values.diagnosis[index];
                const touchedArr = touched.diagnosis?.[index];
                const errorsArr = errors.diagnosis?.[index];

                const getError = (field) =>
                  touchedArr?.[field] && errorsArr?.[field];
                const getFieldName = (field) => `diagnosis[${index}].${field}`;

                return (
                  <React.Fragment key={index}>
                    {isCreate && (
                      <IconButton
                        sx={{ alignSelf: "flex-end" }}
                        size="small"
                        color="error"
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <Input
                          required
                          label="Diagnosis"
                          name={getFieldName("name")}
                          value={valueArr.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={getError("name")}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Input
                          multiline
                          rows={2}
                          value={valueArr.description}
                          required
                          label="Description"
                          name={getFieldName("description")}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={getError("description")}
                        />
                      </Grid>
                    </Grid>
                    {values.diagnosis.length !== index + 1 && (
                      <Divider sx={{ mt: 3, mb: 4 }} />
                    )}
                  </React.Fragment>
                );
              })}
            </Box>
          </>
        );
      }}
    />
  );
};

export default Form;
