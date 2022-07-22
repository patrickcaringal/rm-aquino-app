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
import useMediaQuery from "@mui/material/useMediaQuery";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { FieldArray, FormikProvider, useFormik } from "formik";

import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { formatDate } from "../../../../modules/helper";
import { FamilyMemberSchema } from "../../../../modules/validation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValues = {
  familyMembers: [],
};
// {
//   familyMembers: [
//     {
//       firstName: "PAUL DANIEL",
//       middleName: "PUNSALANG",
//       lastName: "CARINGAL",
//       suffix: "",
//       birthdate: "1997-07-10T13:52:43.000Z",
//       gender: "male",
//       address:
//         "BLK 12 LOT 19 DON ONOFRE VILLAGE, BRGY. BANAY-BANAY, CABUYAO CITY, LAGUN",
//     },
//     {
//       firstName: "APRIL",
//       middleName: "PUNSALANG",
//       lastName: "CARINGAL",
//       suffix: "",
//       birthdate: "1997-07-10T13:52:43.000Z",
//       gender: "male",
//       address:
//         "BLK 12 LOT 19 DON ONOFRE VILLAGE, BRGY. BANAY-BANAY, CABUYAO CITY, LAGUN",
//     },
//   ],
// }

const defaultMemberValue = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  birthdate: "",
  gender: "",
  address: "",
};

const ManageFamilyMemberModal = ({
  open,
  setOpen,
  onCheckDuplicate,
  onAddMemeber,
}) => {
  const isMobileView = useMediaQuery((theme) => theme.breakpoints.only("xs"));
  const { openResponseDialog } = useResponseDialog();

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: FamilyMemberSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      // automatic unverified family member
      const { familyMembers } = values;

      const dupliNames = []; // used for error display

      // Check Duplicates
      const hasDuplicate = familyMembers.reduce((acc, i) => {
        const { firstName, middleName, lastName, birthdate } = i;
        const fullname = `${firstName} ${middleName} ${lastName}`;

        const m = `${fullname} ${formatDate(birthdate)}`;
        const isDupli = onCheckDuplicate(m);

        if (isDupli) dupliNames.push(fullname);

        return acc || isDupli;
      }, false);

      if (hasDuplicate) {
        openResponseDialog({
          content: (
            <>
              <Typography variant="body1">Duplicate Family Members</Typography>
              <Typography variant="body2">{dupliNames.join(", ")}</Typography>
            </>
          ),
          type: "WARNING",
        });

        return;
      }

      onAddMemeber(familyMembers);
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
      fullScreen={isMobileView}
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
                Add Family Member
              </Typography>

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                disabled={values.familyMembers.length === 0}
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
                name="familyMembers"
                render={({ push, remove }) => (
                  <>
                    <Fab
                      color="primary"
                      sx={{ position: "absolute", bottom: 16, right: 16 }}
                      onClick={() => {
                        push(defaultMemberValue);
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
                      {values.familyMembers.map((member, index) => {
                        const famMemberValue = values.familyMembers[index];
                        const famMemberTouched = touched.familyMembers?.[index];
                        const famMemberErrors = errors.familyMembers?.[index];

                        const getError = (key) =>
                          famMemberTouched?.[key] && famMemberErrors?.[key];

                        return (
                          <Card key={index} elevation={2}>
                            <CardHeader
                              avatar={
                                <Avatar
                                  sx={{ bgcolor: "primary.main" }}
                                  aria-label="recipe"
                                >
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
                              title={`Family Member ${index + 1}`}
                            />
                            <CardContent>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="First Name"
                                    name={`familyMembers[${index}].firstName`}
                                    autoComplete="off"
                                    value={famMemberValue.firstName}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `familyMembers[${index}].firstName`,
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
                                    name={`familyMembers[${index}].middleName`}
                                    autoComplete="off"
                                    value={famMemberValue.middleName}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `familyMembers[${index}].middleName`,
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
                                    name={`familyMembers[${index}].lastName`}
                                    autoComplete="off"
                                    value={famMemberValue.lastName}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `familyMembers[${index}].lastName`,
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
                                    name={`familyMembers[${index}].suffix`}
                                    autoComplete="off"
                                    value={famMemberValue.suffix}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `familyMembers[${index}].suffix`,
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
                                      value={famMemberValue.birthdate}
                                      onChange={(value) => {
                                        setFieldValue(
                                          `familyMembers[${index}].birthdate`,
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
                                            name={`familyMembers[${index}].birthdate`}
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
                                      value={famMemberValue.gender}
                                      label="Gender"
                                      onChange={(e) => {
                                        setFieldValue(
                                          `familyMembers[${index}].gender`,
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
                                        {getError("gender")}
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
                                    name={`familyMembers[${index}].address`}
                                    autoComplete="off"
                                    value={famMemberValue.address}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `familyMembers[${index}].address`,
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
            </Container>
          </FormikProvider>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ManageFamilyMemberModal;
