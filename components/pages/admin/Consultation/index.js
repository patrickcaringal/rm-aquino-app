import React, { useEffect, useState } from "react";

import EventNoteIcon from "@mui/icons-material/EventNote";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { addBusinessDays } from "date-fns";

import { RequestStatus } from "../../../../components/shared";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { getAppointmentByDateReq } from "../../../../modules/firebase";
import { formatTimeStamp, today } from "../../../../modules/helper";
import AppointmentDetailModal from "./AppointmentDetailModal";
import ConsultModal from "./ConsultModal";
import Filters from "./Filters";
import useFilter from "./useFilter";

const defaultModal = {
  open: false,
  data: {},
};

const AppointmentsPage = () => {
  const { openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getAppointments] = useRequest(
    getAppointmentByDateReq,
    setBackdropLoader
  );

  // Local States
  const [appointments, setAppointments] = useState([]);
  const [detailModal, setDetailModal] = useState(defaultModal);
  const [consultModal, setConsultModal] = useState(defaultModal);
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
      const payload = { date: formatTimeStamp(addBusinessDays(new Date(), 1)) }; //today.dateStr
      const { data, error: getError } = await getAppointments(payload);
      if (getError) return openErrorDialog(getError);

      setAppointments(data);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDetailModalOpen = (data) => {
    setDetailModal({
      open: true,
      data,
    });
  };

  const handleDetailModalClose = () => {
    setDetailModal(defaultModal);
  };

  const handleConsultModalOpen = (data) => {
    setConsultModal({
      open: true,
      data,
    });
  };

  const handleConsultModalClose = () => {
    setConsultModal(defaultModal);
  };

  return (
    <Box sx={{ pt: 2 }}>
      {/* <Filters
        filters={filters}
        onStatusChange={onStatusChange}
        onDateChange={onDateChange}
      /> */}
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  { text: "Patient Name", sx: { width: 400 } },
                  { text: "Appointment Date", sx: { width: 210 } },
                  { text: "Appointment Day", sx: { width: 210 } },
                  { text: "Appointment Time", sx: { width: 180 } },
                  { text: "Reason for Appointment" },
                  { text: "Actions", align: "center", sx: { width: 120 } },
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
                  reasonAppointment,
                  patientName,
                } = i;

                return (
                  <TableRow key={id}>
                    <TableCell>{patientName}</TableCell>
                    <TableCell>
                      {formatTimeStamp(date, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{formatTimeStamp(date, "EEEE")}</TableCell>
                    <TableCell>
                      {startTime} - {endTimeEstimate}
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
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleConsultModalOpen(i)}
                      >
                        <RecordVoiceOverIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleDetailModalOpen(i)}
                      >
                        <EventNoteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ textAlign: "center", height: 200 }}
                  >
                    <Typography color="text.secondary" fontWeight="medium">
                      No Data to display
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {detailModal.open && (
        <AppointmentDetailModal
          open={detailModal.open}
          data={detailModal.data}
          onClose={handleDetailModalClose}
        />
      )}

      {consultModal.open && (
        <ConsultModal
          open={consultModal.open}
          data={consultModal.data}
          onClose={handleConsultModalClose}
        />
      )}
    </Box>
  );
};

export default AppointmentsPage;
