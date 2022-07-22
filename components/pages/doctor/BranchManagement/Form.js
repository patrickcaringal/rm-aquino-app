import React from "react";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Fab,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { FieldArray } from "formik";

const defaultItem = {
  name: "",
  services: [],
  address: "",
  capacity: "",
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Form = ({
  services,
  // formik
  values,
  touched,
  errors,
  // handleChange,
  handleBlur,
  setFieldValue,
}) => {
  return (
    <FieldArray
      name="branches"
      render={({ push, remove }) => (
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
            {values.branches.map((s, index) => {
              const valueArr = values.branches[index];
              const touchedArr = touched.branches?.[index];
              const errorsArr = errors.branches?.[index];

              const getError = (field) =>
                touchedArr?.[field] && errorsArr?.[field];
              const getFieldName = (field) => `branches[${index}].${field}`;

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
                    title={`Branch ${index + 1}`}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          size="small"
                          required
                          fullWidth
                          label="Branch Name"
                          name={getFieldName("name")}
                          autoComplete="off"
                          value={valueArr.name}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("name"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("name")}
                          helperText={getError("name")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          size="small"
                          required
                          fullWidth
                          label="Capacity"
                          name={getFieldName("capacity")}
                          autoComplete="off"
                          value={valueArr.capacity}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("capacity"),
                              e.target.value
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("capacity")}
                          helperText={getError("capacity")}
                        />
                      </Grid>

                      {/* Common
                          label
                          value
                          onchange
                          options
                          */}
                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          size="small"
                          required
                          error={getError("services")}
                        >
                          <InputLabel>Services</InputLabel>
                          <Select
                            multiple
                            value={valueArr.services}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFieldValue(
                                getFieldName("services"),
                                typeof value === "string"
                                  ? value.split(",")
                                  : value
                              );
                            }}
                            input={<OutlinedInput label="Services" />}
                            renderValue={(selected) => selected.join(", ")}
                            MenuProps={MenuProps}
                          >
                            {services.map(({ id, name }) => (
                              <MenuItem key={id} value={name}>
                                <Checkbox
                                  checked={valueArr.services.includes(name)}
                                />
                                <ListItemText primary={name} />
                              </MenuItem>
                            ))}
                          </Select>
                          {getError("services") && (
                            <FormHelperText>
                              {getError("services")}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          multiline
                          rows={2}
                          size="small"
                          required
                          fullWidth
                          label="Address"
                          name={getFieldName("address")}
                          autoComplete="off"
                          value={valueArr.address}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("address"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("address")}
                          helperText={getError("address")}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </>
      )}
    />
  );
};

export default Form;
