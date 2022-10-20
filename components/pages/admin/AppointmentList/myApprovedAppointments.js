import React, { useEffect, useState } from "react";

import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
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
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  approveAppointmentReq,
  getDoctorAppointmentByDateReq,
  rejectAppointmentReq,
} from "../../../../modules/firebase";
import {
  formatTimeStamp,
  getNearestBusinessDay,
} from "../../../../modules/helper";
import {
  ACTION_BUTTONS,
  LongTypography,
  TablePlaceholder,
  getActionButtons,
  successMessage,
} from "../../../common";
import { REQUEST_STATUS, RejectModal } from "../../../shared";
import ConsultModal from "../Consultation/ConsultModal";
import Filters from "./Filters";
import useFilter from "./useFilter";

const defaultModal = {
  open: false,
  data: {},
};

const MyApprovedAppointmentsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { openResponseDialog, openErrorDialog, closeDialog } =
    useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();
  const doctorId = router.query.id;

  // Requests
  const [getAppointments] = useRequest(
    getDoctorAppointmentByDateReq,
    setBackdropLoader
  );

  // Local States
  const [appointments, setAppointments] = useState([]);
  const [consultModal, setConsultModal] = useState(defaultModal);

  const baseDay = getNearestBusinessDay(router.query?.date);
  const { filtered, setData, filters, onStatusChange, onDateChange } =
    useFilter({
      defaultStatus: "all",
      defaultDate: baseDay,
    });

  useEffect(() => {
    setData(appointments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments]);

  useEffect(() => {
    // Get
    const fetch = async () => {
      const payload = {
        id: doctorId,
        date: filters.date,
        status: [REQUEST_STATUS.approved],
      };
      const { data, error } = await getAppointments(payload);
      if (error) return openErrorDialog(error);
      setAppointments(data);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.date]);

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
      <Filters
        filters={filters}
        onStatusChange={onStatusChange}
        onDateChange={onDateChange}
        displayStatus={false}
      />
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  { text: "Patient Name" },
                  { text: "Appointment Date", sx: { width: 210 } },
                  { text: "Appointment Time", sx: { width: 180 } },
                  { text: "Service", sx: { width: 360 } },
                  { text: "Actions", align: "center", sx: { width: 110 } },
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
                  service,
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
                    <TableCell>{service}</TableCell>
                    {/* <TableCell>
                      <LongTypography
                        text={reasonAppointment}
                        displayedLines={2}
                      />
                    </TableCell> */}
                    <TableCell align="center">
                      {getActionButtons([
                        {
                          action: ACTION_BUTTONS.DIAGNOSE,
                          color: "success",
                          onClick: () => handleConsultModalOpen(i),
                        },
                      ])}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {consultModal.open && (
        <ConsultModal
          open={consultModal.open}
          data={consultModal.data}
          onClose={handleConsultModalClose}
          setAppointments={setAppointments}
        />
      )}
    </Box>
  );
};

export default MyApprovedAppointmentsPage;
