import React from "react";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  Fab,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { FieldArray, FormikProvider, useFormik } from "formik";

import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { getFullName, getUniquePersonId } from "../../../../modules/helper";
import { StaffSchema } from "../../../../modules/validation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValues = {
  staffs: [],
};

// {
//   staffs: [
//     {
//       firstName: "KIM",
//       middleName: "SOYA",
//       lastName: "JISOO",
//       suffix: "",
//       birthdate: "1997-07-10T13:52:43.000Z",
//       gender: "female",
//       address:
//         "BLK 12 LOT 19 DON ONOFRE VILLAGE, BRGY. BANAY-BANAY, CABUYAO CITY, LAGUNA",
//       email: "soya@gmail.com",
//       branch: "LAKESIDE",
//     },
//     {
//       firstName: "KIM",
//       middleName: "SOYA",
//       lastName: "JISOO",
//       suffix: "",
//       birthdate: "1997-07-11T13:52:43.000Z",
//       gender: "female",
//       address:
//         "BLK 12 LOT 19 DON ONOFRE VILLAGE, BRGY. BANAY-BANAY, CABUYAO CITY, LAGUNA",
//       email: "soya2@gmail.com",
//       branch: "LAKESIDE",
//     },
//   ],
// }

const defaultStaffValue = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  birthdate: "",
  gender: "",
  address: "",
  email: "",
  branch: "",
};

export default function ManageStaffModal({
  open,
  setOpen,
  onCheckDuplicate,
  onAddStaff,
}) {
  const { openResponseDialog } = useResponseDialog();

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: StaffSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { staffs } = values;
      const dupliNames = []; // used for error display

      // Check Duplicates
      const hasDuplicate = staffs.reduce((acc, i) => {
        const { firstName, middleName, lastName, birthdate } = i;
        const m = getUniquePersonId({
          firstName,
          middleName,
          lastName,
          birthdate,
        });
        const isDupli = onCheckDuplicate(m);
        const fullname = getFullName({
          firstName,
          middleName,
          lastName,
        });
        if (isDupli) dupliNames.push(fullname);
        return acc || isDupli;
      }, false);

      if (hasDuplicate) {
        openResponseDialog({
          content: (
            <>
              <Typography variant="body1">Staff already exist</Typography>
              <Typography variant="body2">{dupliNames.join(", ")}</Typography>
            </>
          ),
          type: "WARNING",
        });
        return;
      }

      // Add Staff
      onAddStaff(staffs);
    },
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    errors,
    touched,
    resetForm,
  } = formik;

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ overflow: "overlay" }}
      >
        <AppBar sx={{ position: "sticky" }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Add Staff
              </Typography>

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                disabled={values.staffs.length === 0}
              >
                save
              </Button>
              <Button color="inherit" onClick={handleClose}>
                Cancel
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Box sx={{ py: 2 }}>
          <FormikProvider value={formik}>
            <Container maxWidth="lg">
              <FieldArray
                name="staffs"
                render={({ push, remove }) => (
                  <>
                    <Fab
                      color="primary"
                      sx={{ position: "absolute", bottom: 16, right: 16 }}
                      onClick={() => {
                        push(defaultStaffValue);
                      }}
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
                      {formik.values.staffs.map((s, index) => {
                        const staffValue = values.staffs[index];
                        const staffTouched = touched.staffs?.[index];
                        const staffErrors = errors.staffs?.[index];
                        const getError = (field) =>
                          staffTouched?.[field] && staffErrors?.[field];

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
                              title={`Staff ${index + 1}`}
                            />
                            <CardContent>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="First Name"
                                    name={`staffs[${index}].firstName`}
                                    autoComplete="off"
                                    value={staffValue.firstName}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `staffs[${index}].firstName`,
                                        e.target.value.toUpperCase()
                                      )
                                    }
                                    onBlur={handleBlur}
                                    error={getError("firstName")}
                                    helperText={getError("firstName")}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="Middle Name"
                                    name={`staffs[${index}].middleName`}
                                    autoComplete="off"
                                    value={staffValue.middleName}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `staffs[${index}].middleName`,
                                        e.target.value.toUpperCase()
                                      )
                                    }
                                    onBlur={handleBlur}
                                    error={getError("middleName")}
                                    helperText={getError("middleName")}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="Last Name"
                                    name={`staffs[${index}].lastName`}
                                    autoComplete="off"
                                    value={staffValue.lastName}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `staffs[${index}].lastName`,
                                        e.target.value.toUpperCase()
                                      )
                                    }
                                    onBlur={handleBlur}
                                    error={getError("lastName")}
                                    helperText={getError("lastName")}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    label="Suffix"
                                    name={`staffs[${index}].suffix`}
                                    autoComplete="off"
                                    value={staffValue.suffix}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `staffs[${index}].suffix`,
                                        e.target.value.toUpperCase()
                                      )
                                    }
                                    onBlur={handleBlur}
                                    error={getError("suffix")}
                                    helperText={getError("suffix")}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <MobileDatePicker
                                      label="Date of Birth"
                                      inputFormat="MM/dd/yyyy"
                                      value={staffValue.birthdate}
                                      onChange={(value) => {
                                        setFieldValue(
                                          `staffs[${index}].birthdate`,
                                          value,
                                          false
                                        );
                                      }}
                                      onBlur={handleBlur}
                                      renderInput={(params) => {
                                        return (
                                          <TextField
                                            size="small"
                                            {...params}
                                            required
                                            fullWidth
                                            name={`staffs[${index}].birthdate`}
                                            error={getError("birthdate")}
                                            helperText={getError("birthdate")}
                                          />
                                        );
                                      }}
                                    />
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <FormControl
                                    fullWidth
                                    size="small"
                                    required
                                    error={getError("gender")}
                                  >
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                      value={staffValue.gender}
                                      label="Gender"
                                      onChange={(e) => {
                                        setFieldValue(
                                          `staffs[${index}].gender`,
                                          e.target.value,
                                          false
                                        );
                                      }}
                                      onBlur={handleBlur}
                                    >
                                      <MenuItem value="male">Male</MenuItem>
                                      <MenuItem value="female">Female</MenuItem>
                                    </Select>
                                    {getError("gender") && (
                                      <FormHelperText>
                                        {staffErrors?.gender}
                                      </FormHelperText>
                                    )}
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="Full Address"
                                    name={`staffs[${index}].address`}
                                    autoComplete="off"
                                    value={staffValue.address}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `staffs[${index}].address`,
                                        e.target.value.toUpperCase()
                                      )
                                    }
                                    onBlur={handleBlur}
                                    error={getError("address")}
                                    helperText={getError("address")}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="Email"
                                    name={`staffs[${index}].email`}
                                    autoComplete="off"
                                    value={staffValue.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={getError("email")}
                                    helperText={getError("email")}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <FormControl
                                    fullWidth
                                    size="small"
                                    required
                                    error={getError("branch")}
                                  >
                                    <InputLabel>Branch</InputLabel>
                                    <Select
                                      value={staffValue.branch}
                                      label="Branch"
                                      onChange={(e) => {
                                        setFieldValue(
                                          `staffs[${index}].branch`,
                                          e.target.value,
                                          false
                                        );
                                      }}
                                      onBlur={handleBlur}
                                    >
                                      <MenuItem value="LAKESIDE">
                                        Lakeside
                                      </MenuItem>
                                      <MenuItem value="MABUHAY">
                                        Mabuhay
                                      </MenuItem>
                                      <MenuItem value="SOUTHVILLE">
                                        Sunrise
                                      </MenuItem>
                                    </Select>
                                    {getError("branch") && (
                                      <FormHelperText>
                                        {staffErrors?.branch}
                                      </FormHelperText>
                                    )}
                                  </FormControl>
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
            </Container>
          </FormikProvider>
        </Box>
      </Box>
    </Dialog>
  );
}
