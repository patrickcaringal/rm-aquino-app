import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControlLabel,
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
import { Input } from "../../../../components/common/Form";
import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { db, getPatientAppointmentReq } from "../../../../modules/firebase";
import { formatTimeStamp, today } from "../../../../modules/helper";

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
      {/* <Box sx={{ mb: 2 }}>
        <Button variant="contained" size="small" onClick={() => {}}>
          submit appointment
        </Button>
      </Box> */}

      <Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  { text: "Appointment Date", sx: { width: 200 } },
                  { text: "Appointment Time", sx: { width: 200 } },
                  { text: "Status", sx: { width: 200 } },
                  { text: "Reason for Appointment" },
                  // { text: "Actions", align: "center", sx: { width: 110 } },
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

            <TableBody>
              {appointments.map((i) => {
                const {
                  id,
                  date,
                  dateCreated,
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
                        {formatTimeStamp(dateCreated, "MMM dd, yyyy (EEEE)")}
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
