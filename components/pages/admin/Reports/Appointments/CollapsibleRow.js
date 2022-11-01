import React, { useEffect, useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import lodash from "lodash";
import { useRouter } from "next/router";

import {
  REQUEST_STATUS,
  RejectModal,
  RequestStatus,
} from "../../../../../components/shared";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../../hooks/useRequest";
import { getMedicalRecordsReq } from "../../../../../modules/firebase";
import {
  formatTimeStamp,
  getNearestBusinessDay,
} from "../../../../../modules/helper";
import {
  ACTION_BUTTONS,
  LongTypography,
  TablePlaceholder,
  getActionButtons,
  successMessage,
} from "../../../../common";

const CollapsibleRow = ({ data }) => {
  const [detailRowOpen, setDetailRowOpen] = useState(false);

  let { date, data: consultations } = data;

  consultations = consultations.sort(
    (a, b) =>
      new Date(`${a.date} ${a.startTime}`) -
      new Date(`${b.date} ${b.startTime}`)
  );

  return (
    <>
      <TableRow>
        <TableCell sx={{ width: 60 }}>
          <IconButton
            size="small"
            onClick={() => setDetailRowOpen(!detailRowOpen)}
          >
            {detailRowOpen ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>
        <TableCell>{formatTimeStamp(date, "MMM-dd-yyyy EEEE")}</TableCell>
        <TableCell>{consultations.length}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={6}>
          <Collapse in={detailRowOpen} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {[
                        { text: "Time", sx: { width: 200 } },
                        { text: "Patient" },
                        { text: "Doctor", sx: { width: 300 } },
                        { text: "Service", sx: { width: 300 } },
                      ].map(({ text, align, sx }) => (
                        <TableCell
                          key={text}
                          {...(align && { align })}
                          sx={{ ...sx, fontWeight: "bold" }}
                        >
                          {text}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {consultations.map((i) => {
                      return (
                        <TableRow key={i.date}>
                          <TableCell>
                            {i.startTime} - {i.endTimeEstimate}
                          </TableCell>
                          <TableCell>{i.patientName}</TableCell>
                          <TableCell>{i.doctor}</TableCell>
                          <TableCell>{i.service}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CollapsibleRow;
