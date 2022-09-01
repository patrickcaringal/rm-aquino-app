import React from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { formatTimeStamp } from "../../../../modules/helper";

const PatientRecord = ({ data = [], onRecordClick }) => {
  return (
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
            {data.map((i, index) => {
              const { date, reasonAppointment, diagnosis } = i;
              return (
                <TableRow key={index}>
                  <TableCell>{formatTimeStamp(date, "MMM dd, yyyy")}</TableCell>
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
  );
};

export default PatientRecord;
