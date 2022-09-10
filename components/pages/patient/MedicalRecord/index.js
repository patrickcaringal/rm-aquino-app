import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { getPatientRecordReq } from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import { LongTypography } from "../../../common";
import { DatePicker, Select } from "../../../common/Form";
import { RequestStatus } from "../../../shared";
import useFilter from "./useFilter";

const MedicalRecordPage = () => {
  const { user } = useAuth();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getPatientRecord] = useRequest(getPatientRecordReq, setBackdropLoader);

  // Local States
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      // Get Medical Record
      const payload = { id: user.id };
      const { data, error: getError } = await getPatientRecord(payload);
      if (getError) return openErrorDialog(getError);

      setMedicalRecords(data);
    };

    fetchMedicalRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ pt: 2 }}>
      <Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  { text: "Date of Visit", sx: { width: 140 } },
                  { text: "Reason for Visit" },
                  { text: "Doctor Diagnosis" },
                ].map(({ text, align, sx }) => (
                  <TableCell
                    key={text}
                    {...(align && { align })}
                    sx={{ ...sx, fontWeight: "bold", p: 2 }}
                  >
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {medicalRecords.map((i, index) => {
                const { date, reasonAppointment, diagnosis } = i;
                return (
                  <TableRow key={index}>
                    <TableCell>
                      {formatTimeStamp(date, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ whiteSpace: "pre-line" }}
                        component="div"
                      >
                        {reasonAppointment}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ whiteSpace: "pre-line" }}
                        component="div"
                      >
                        {diagnosis}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default MedicalRecordPage;
