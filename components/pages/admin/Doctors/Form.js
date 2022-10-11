import React from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Checkbox,
  Divider,
  Fab,
  FilledInput,
  Grid,
  IconButton,
  ListItemText,
  MenuItem,
} from "@mui/material";
import faker from "faker";
import { FieldArray } from "formik";

import { isMockDataEnabled } from "../../../../modules/env";
import { formatTimeStamp } from "../../../../modules/helper";
import { DatePicker, Input, Select } from "../../../common/Form";

const defaultItem = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  birthdate: "",
  gender: "",
  address: "",
  email: "",
};

const Form = ({
  services,
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
      name="staffs"
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
                          firstName: faker.name.firstName(),
                          suffix: "",
                          lastName: faker.name.lastName(),
                          middleName: faker.name.lastName(),
                          email: faker.internet.email(),
                          address: faker.lorem.paragraph(),
                          birthdate: faker.date.past(
                            faker.datatype.number({
                              min: 500_000,
                              max: 1_00_000,
                            })
                          ),
                          gender: faker.random.arrayElement(["male", "female"]),
                        }
                      : defaultItem
                  );
                }}
                size="small"
              >
                <AddIcon sx={{ mr: 1 }} />
                Add staff
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
              {values.staffs.map((s, index) => {
                const valueArr = values.staffs[index];
                const touchedArr = touched.staffs?.[index];
                const errorsArr = errors.staffs?.[index];

                const getError = (field) =>
                  touchedArr?.[field] && errorsArr?.[field];
                const getFieldName = (field) => `staffs[${index}].${field}`;

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
                    <Grid key={index} container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Input
                          required
                          label="First Name"
                          name={getFieldName("firstName")}
                          value={valueArr.firstName}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("firstName"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("firstName")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Input
                          // required
                          label="Middle Name"
                          name={getFieldName("middleName")}
                          value={valueArr.middleName}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("middleName"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("middleName")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Input
                          required
                          label="Last Name"
                          name={getFieldName("lastName")}
                          value={valueArr.lastName}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("lastName"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("lastName")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Input
                          label="Suffix"
                          name={getFieldName("suffix")}
                          value={valueArr.suffix}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("suffix"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("suffix")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <DatePicker
                          value={valueArr.birthdate}
                          required
                          label="Date of Birth"
                          name={getFieldName("birthdate")}
                          onChange={(value) => {
                            setFieldValue(
                              getFieldName("birthdate"),
                              formatTimeStamp(value),
                              false
                            );
                          }}
                          onBlur={handleBlur}
                          error={getError("birthdate")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Select
                          required
                          label="Gender"
                          value={valueArr.gender}
                          onChange={(e) => {
                            setFieldValue(
                              getFieldName("gender"),
                              e.target.value,
                              false
                            );
                          }}
                          onBlur={handleBlur}
                          error={getError("gender")}
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Input
                          required
                          label="Contact No."
                          name={getFieldName("contactNo")}
                          value={valueArr.contactNo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={getError("contactNo")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Input
                          required
                          label="Specialty"
                          name={getFieldName("specialty")}
                          value={valueArr.specialty}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={getError("specialty")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Select
                          multiple
                          required
                          label="Services"
                          value={valueArr.services}
                          input={<FilledInput label="Services" />}
                          renderValue={(selected) => selected.join(", ")}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFieldValue(
                              getFieldName("services"),
                              typeof value === "string"
                                ? value.split(",")
                                : value
                            );
                          }}
                          onBlur={handleBlur}
                          error={getError("services")}
                        >
                          {services.map(({ id, name }) => (
                            <MenuItem key={id} value={name}>
                              <Checkbox
                                checked={valueArr?.services?.includes(name)}
                              />
                              <ListItemText primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Input
                          // disabled={!!valueArr.email}
                          required
                          label="Email"
                          name={getFieldName("email")}
                          value={valueArr.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={getError("email")}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Input
                          multiline
                          rows={2}
                          value={valueArr.address}
                          required
                          label="Full Address"
                          name={getFieldName("address")}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("address"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("address")}
                        />
                      </Grid>
                    </Grid>
                    {values.staffs.length !== index + 1 && (
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
