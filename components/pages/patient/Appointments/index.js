import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import {
  addBusinessDays,
  addDays,
  addMinutes,
  eachMinuteOfInterval,
  format,
  getWeek,
  isAfter,
  isBefore,
  isSameDay,
  isWeekend,
  startOfToday,
  subBusinessDays,
} from "date-fns";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useFormik } from "formik";
import lodash from "lodash";

import { successMessage } from "../../../../components/common";
import { DatePicker, Select } from "../../../../components/common/Form";
import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { db, getPatientAppointmentReq } from "../../../../modules/firebase";
import { formatTimeStamp, today } from "../../../../modules/helper";
import useFilter from "./useFilter";

const AppointmentsPage = () => {
  const { user } = useAuth();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getAppointments] = useRequest(
    getPatientAppointmentReq,
    setBackdropLoader
  );

  // Local States
  const [appointments, setAppointments] = useState([]);
  const { filtered, setData, filters, onStatusChange, onDateChange } =
    useFilter({
      defaultStatus: "all",
    });

  useEffect(() => {
    setData(appointments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments]);

  useEffect(() => {
    const fetch = async () => {
      // Get Staffs
      const payload = { id: user.id };
      const { data: appointmentList, error: getError } = await getAppointments(
        payload
      );
      if (getError) return openErrorDialog(getError);

      setAppointments(appointmentList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ mb: 2, display: "flex", flexDirection: "row", gap: 2 }}>
        <Box sx={{ width: 200 }}>
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => {
              onStatusChange(e.target.value);
            }}
          >
            <MenuItem value="all" dense>
              All
            </MenuItem>
            <MenuItem value="for approval" dense>
              For Approval
            </MenuItem>
            <MenuItem value="approved" dense>
              Approved
            </MenuItem>
            <MenuItem value="rejected" dense>
              Rejected
            </MenuItem>
          </Select>
        </Box>
        <Box sx={{ width: 200 }}>
          <DatePicker
            label="Date"
            value={filters.date}
            onChange={(value) => {
              onDateChange(value ? formatTimeStamp(value) : "");
            }}
          />
        </Box>
      </Box>

      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  { text: "Appointment Date", sx: { width: 220 } },
                  { text: "Appointment Time", sx: { width: 200 } },
                  { text: "Status", sx: { width: 200 } },
                  { text: "Reason for Appointment" },
                  // { text: "Actions", align: "center", sx: { width: 110 } },
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
              {filtered.map((i) => {
                const {
                  id,
                  date,
                  startTime,
                  endTimeEstimate,
                  approved,
                  rejected,
                  reasonAppointment,
                } = i;

                return (
                  <TableRow key={id}>
                    <TableCell>
                      <Typography variant="body2">
                        {formatTimeStamp(date, "MMM dd, yyyy (EEEE)")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {startTime} - {endTimeEstimate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {approved && (
                        <Typography variant="body2">approved</Typography>
                      )}
                      {rejected && (
                        <Typography variant="body2">rejected</Typography>
                      )}
                      {!approved && !rejected && (
                        <Typography variant="body2">for approval</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: "1",
                          overflow: "hidden",
                        }}
                        component="div"
                      >
                        {reasonAppointment}
                      </Typography>
                    </TableCell>
                    {/* <TableCell sx={{ width: 110 }} align="center"></TableCell> */}
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

export default AppointmentsPage;
