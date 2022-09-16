import React from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { formatTimeStamp } from "../../../../modules/helper";
import { LongTypography, TablePlaceholder } from "../../../common";

const PatientRecord = ({ data = [] }) => {
  return (
    <Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                { text: "Date of Visit" },
                { text: "Reason for Visit", sx: { width: 400 } },
                { text: "Doctor Diagnosis", sx: { width: 400 } },
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
                    <LongTypography
                      text={reasonAppointment}
                      whiteSpace="pre-line"
                    />
                  </TableCell>
                  <TableCell>
                    <LongTypography text={diagnosis} whiteSpace="pre-line" />
                  </TableCell>
                </TableRow>
              );
            })}
            <TablePlaceholder visible={data.length === 0} colSpan={3} />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientRecord;
