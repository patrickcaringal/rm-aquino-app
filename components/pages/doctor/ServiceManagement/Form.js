import React from "react";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { FieldArray } from "formik";

const defaultItem = {
  name: "",
  description: "",
};

const Form = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  return (
    <FieldArray
      name="services"
      render={({ push, remove }) => {
        return (
          <>
            <Fab
              color="primary"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              onClick={() => {
                push(defaultItem);
              }}
              size="small"
            >
              <AddIcon />
            </Fab>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                px: 1,
                py: 1,
                rowGap: 3,
                overflow: "overlay",
                minHeight: 280,
              }}
            >
              {values.services.map((s, index) => {
                const valueArr = values.services[index];
                const touchedArr = touched.services?.[index];
                const errorsArr = errors.services?.[index];

                const getError = (field) =>
                  touchedArr?.[field] && errorsArr?.[field];
                const getFieldName = (field) => `services[${index}].${field}`;

                return (
                  <Card key={index} elevation={2}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {index + 1}
                        </Avatar>
                      }
                      action={
                        <>
                          <IconButton
                            size="small"
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </>
                      }
                      title={`Service ${index + 1}`}
                    />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                          <TextField
                            size="small"
                            required
                            fullWidth
                            label="Service"
                            name={getFieldName("name")}
                            autoComplete="off"
                            value={valueArr.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={getError("name")}
                            helperText={getError("name")}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            size="small"
                            required
                            fullWidth
                            label="Description"
                            name={`services[${index}].description`}
                            autoComplete="off"
                            value={valueArr.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={getError("description")}
                            helperText={getError("description")}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
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
