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
import { LongTypography, successMessage } from "../../../common";
import { REQUEST_STATUS, RejectModal } from "../../../shared";
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
  const [approveAppointment] = useRequest(
    approveAppointmentReq,
    setBackdropLoader
  );
  const [rejectAppointment] = useRequest(
    rejectAppointmentReq,
    setBackdropLoader
  );

  // Local States
  const [appointments, setAppointments] = useState([]);
  const [rejectModal, setRejectModal] = useState(defaultModal);

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

  const handleApproveConfirmation = (document) => {
    const { patientName, date, startTime, endTimeEstimate } = document;

    openResponseDialog({
      title: "Approve Appointment",
      content: (
        <>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to approve?
          </Typography>
          <Typography variant="body2">{`${patientName}`}</Typography>
          <Typography variant="body2">
            {formatTimeStamp(date, "MMM dd, yyyy (EEEE)")} {startTime} -{" "}
            {endTimeEstimate}
          </Typography>
        </>
      ),
      type: "CONFIRM",
      actions: (
        <Button
          variant="contained"
          onClick={() => {
            closeDialog();
            setTimeout(() => {
              handleApprove(document);
            }, 500);
          }}
          size="small"
        >
          Approve
        </Button>
      ),
    });
  };

  const handleRejectConfirmation = (data) => {
    setRejectModal({
      open: true,
      data,
    });
  };

  const handleApprove = async (document) => {
    // Approve
    const payload = { document: { ...document, approvedBy: user.id } };
    const { error: approveError } = await approveAppointment(payload);
    if (approveError) return openErrorDialog(approveError);

    // Success
    setAppointments((prev) => prev.filter((i) => i.id !== document.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Appointment",
        verb: "approved",
      }),
      type: "SUCCESS",
    });
  };

  const handleReject = async (document) => {
    // Reject
    const payload = { document: { ...document, rejectedBy: user.id } };
    const { error: rejectError } = await rejectAppointment(payload);
    if (rejectError) return openErrorDialog(rejectError);

    // Success
    setAppointments((prev) => prev.filter((i) => i.id !== document.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Appointment",
        verb: "rejected",
      }),
      type: "SUCCESS",
      closeCb() {
        setRejectModal(defaultModal);
      },
    });
  };

  const handleRejectModalClose = () => {
    setRejectModal(defaultModal);
  };

  const rejectModalContent = () => {
    const { patientName, date, startTime, endTimeEstimate } = rejectModal.data;
    return (
      <>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to reject?
        </Typography>
        <Typography variant="body2">{`${patientName}`}</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {formatTimeStamp(date, "MMM dd, yyyy (EEEE)")} {startTime} -{" "}
          {endTimeEstimate}
        </Typography>
      </>
    );
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
                  dateCreated,
                  startTime,
                  endTimeEstimate,
                  status,
                  doctor,
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
                    <TableCell align="center"></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {rejectModal.open && (
        <RejectModal
          open={rejectModal.open}
          data={rejectModal.data}
          content={rejectModalContent()}
          title="Reject Appointment"
          onClose={handleRejectModalClose}
          onReject={handleReject}
        />
      )}
    </Box>
  );
};

export default MyApprovedAppointmentsPage;
