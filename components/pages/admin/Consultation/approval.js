import React, { useCallback, useEffect, useState } from "react";

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
import { useFormik } from "formik";

import { ResponseDialog, successMessage } from "../../../../components/common";
import { Input } from "../../../../components/common/Form";
import { RejectModal, RequestStatus } from "../../../../components/shared";
import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  approveAppointmentReq,
  getAppointmentForApprovalReq,
  rejectAppointmentReq,
} from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import Filters from "./Filters";
import useFilter from "./useFilter";

const defaultModal = {
  open: false,
  data: {},
};

const AppointmentsPage = () => {
  const { user } = useAuth();
  const { openResponseDialog, openErrorDialog, closeDialog } =
    useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getAppointments] = useRequest(
    getAppointmentForApprovalReq,
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

  const { filtered, setData, filters, onStatusChange, onDateChange } =
    useFilter({
      defaultStatus: "all",
    });

  useEffect(() => {
    setData(appointments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments]);

  useEffect(() => {
    // Get
    const fetch = async () => {
      const { data: appointmentList, error: getError } =
        await getAppointments();
      if (getError) return openErrorDialog(getError);

      setAppointments(appointmentList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  { text: "Date Requested", sx: { width: 210 } },
                  { text: "Appointment Date", sx: { width: 210 } },
                  { text: "Appointment Time", sx: { width: 180 } },
                  { text: "Status", sx: { width: 160 } },
                  { text: "Reason for Appointment" },
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
                  reasonAppointment,
                  patientName,
                } = i;

                return (
                  <TableRow key={id}>
                    <TableCell>{patientName}</TableCell>
                    <TableCell>
                      {formatTimeStamp(dateCreated, "MMM dd, yyyy (EEEE)")}
                    </TableCell>
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
                    <TableCell sx={{ width: 110 }} align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleApproveConfirmation(i)}
                      >
                        <ThumbUpIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRejectConfirmation(i)}
                      >
                        <ThumbDownIcon />
                      </IconButton>
                    </TableCell>
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

export default AppointmentsPage;
