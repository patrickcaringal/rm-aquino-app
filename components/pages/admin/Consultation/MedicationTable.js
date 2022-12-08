import React, { useEffect, useRef, useState } from "react";

import {
  Autocomplete,
  Box,
  Button,
  Divider,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import faker from "faker";
import { FieldArray, FormikProvider, useFormik } from "formik";
import lodash from "lodash";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { getBaseApi, isMockDataEnabled } from "../../../../modules/env";
import {
  SERVICE_TYPE,
  diagnosePatientReq,
  getPatientRecordReq,
  getPatientReq,
} from "../../../../modules/firebase";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";
import { DiagnoseSchema, ReferSchema } from "../../../../modules/validation";
import { ACTION_BUTTONS, getActionButtons } from "../../../common";
import { Input, Select } from "../../../common/Form";
import PatientRecord from "./PatientRecord";
import ReferralForm from "./ReferralForm";

const MedicationTable = ({ formik, onClose, onSave }) => {
  const arrayHelpersRef = useRef(null);

  const { values, touched, errors, handleChange, submitForm } = formik;

  return (
    <Box>
      <FormikProvider value={formik}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="body1" fontWeight="500">
            Medications
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              arrayHelpersRef.current.push(
                isMockDataEnabled
                  ? {
                      name: faker.lorem.words(1),
                      dosage: "mg",
                      frequency: "2 times a day",
                      remarks: faker.lorem.words(4),
                    }
                  : {
                      name: "",
                      dosage: "",
                      frequency: "",
                      remarks: "",
                    }
              );
            }}
          >
            Add medication
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  { text: "Medecine", sx: { width: 200 } },
                  { text: "Dosage", sx: { width: 150 } },
                  { text: "Frequency", sx: { width: 200 } },
                  { text: "Remarks" },
                  { text: "Actions", align: "center", sx: { width: 50 } },
                ].map(({ text, align, sx }) => (
                  <TableCell
                    key={text}
                    {...(align && { align })}
                    {...(sx && { sx: { ...sx, fontWeight: "bold" } })}
                  >
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <FieldArray
              name="medications"
              render={(arrayHelpers) => {
                arrayHelpersRef.current = arrayHelpers;

                return (
                  <TableBody>
                    {values.medications.map((i, index) => {
                      const valueArr = values.medications[index];
                      const touchedArr = touched.medications?.[index];
                      const errorsArr = errors.medications?.[index];

                      const getError = (field) =>
                        touchedArr?.[field] && errorsArr?.[field];
                      const getFieldName = (field) =>
                        `medications[${index}].${field}`;

                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Input
                              variant="standard"
                              name={getFieldName("name")}
                              value={valueArr.name}
                              onChange={handleChange}
                            />
                          </TableCell>

                          <TableCell>
                            <Input
                              variant="standard"
                              name={getFieldName("dosage")}
                              value={valueArr.dosage}
                              onChange={handleChange}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              variant="standard"
                              name={getFieldName("frequency")}
                              value={valueArr.frequency}
                              onChange={handleChange}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              variant="standard"
                              multiline
                              name={getFieldName("remarks")}
                              value={valueArr.remarks}
                              onChange={handleChange}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {getActionButtons([
                              {
                                action: ACTION_BUTTONS.DELETE,
                                color: "error",
                                onClick: () => arrayHelpers.remove(index),
                              },
                            ])}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                );
              }}
            />
          </Table>
        </TableContainer>
      </FormikProvider>
    </Box>
  );
};

export default MedicationTable;
