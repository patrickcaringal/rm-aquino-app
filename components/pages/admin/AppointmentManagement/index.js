import React, { useEffect, useState } from "react";

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

import { RequestStatus } from "../../../../components/shared";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { getAppointmentReq } from "../../../../modules/firebase";
import {
  formatTimeStamp,
  getNearestBusinessDay,
} from "../../../../modules/helper";
import Filters from "./Filters";
import useFilter from "./useFilter";

const AppointmentsPage = () => {
  const { openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getAppointments] = useRequest(getAppointmentReq, setBackdropLoader);

  // Local States
  const [appointments, setAppointments] = useState([]);
  const { filtered, setData, filters, onStatusChange, onDateChange } =
    useFilter({
      defaultStatus: "all",
      defaultDate: getNearestBusinessDay(new Date()),
    });

  useEffect(() => {
    setData(appointments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments]);

  useEffect(() => {
    const fetch = async () => {
      const { data: appointmentList, error: getError } =
        await getAppointments();
      if (getError) return openErrorDialog(getError);

      setAppointments(appointmentList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ pt: 2 }}>
      <Filters
        filters={filters}
        onStatusChange={onStatusChange}
        onDateChange={onDateChange}
      />
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  { text: "Paatient Name" },
                  { text: "Appointment Date", sx: { width: 210 } },
                  { text: "Appointment Time", sx: { width: 180 } },
                  { text: "Status", sx: { width: 160 } },
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
                  dateCreated,
                  startTime,
                  endTimeEstimate,
                  status,
                  reasonAppointment,
                  patientName,
                } = i;

                return (
                  <TableRow key={id}>
                    <TableCell>{patientName}</TableCell>
                    <TableCell>
                      {formatTimeStamp(date, "MMM dd, yyyy (EEEE)")}
                    </TableCell>
                    <TableCell>
                      {startTime} - {endTimeEstimate}
                    </TableCell>
                    <TableCell>
                      <RequestStatus status={status} />
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
