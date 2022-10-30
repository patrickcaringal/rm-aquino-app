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

import {
  REQUEST_STATUS,
  RejectModal,
  RequestStatus,
} from "../../../../components/shared";
import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  approveAppointmentReq,
  getAppointmentByDateStatusReq,
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
  const multiDoctorMode = !doctorId;

  // Requests
  const [getAppointments] = useRequest(
    multiDoctorMode
      ? getAppointmentByDateStatusReq
      : getDoctorAppointmentByDateReq,
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
  const [consultModal, setConsultModal] = useState(defaultModal);
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

  // Get
  const fetchAppointments = async () => {
    const payload = {
      id: doctorId,
      date: filters.date,
      status: [
        REQUEST_STATUS.forapproval,
        REQUEST_STATUS.approved,
        REQUEST_STATUS.done,
      ],
    };
    const { data, error } = await getAppointments(payload);
    if (error) return openErrorDialog(error);
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
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
    // setAppointments((prev) => prev.filter((i) => i.id !== document.id));
    fetchAppointments();
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
                  {
                    text: multiDoctorMode ? "Doctor / Service" : "Service",
                    sx: { width: 360 },
                  },
                  { text: "Status", sx: { width: 160 } },
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
                  doctor,

                  service,
                  patientName,
                  status,
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
                      {multiDoctorMode ? (
                        <>
                          {doctor} <br />
                          {service}
                        </>
                      ) : (
                        service
                      )}
                    </TableCell>
                    <TableCell>
                      <RequestStatus status={status} />
                    </TableCell>
                    <TableCell align="center">
                      {status === REQUEST_STATUS.approved &&
                        !multiDoctorMode &&
                        getActionButtons([
                          {
                            action: ACTION_BUTTONS.DIAGNOSE,
                            color: "success",
                            onClick: () => handleConsultModalOpen(i),
                          },
                        ])}

                      {status === REQUEST_STATUS.forapproval &&
                        getActionButtons([
                          {
                            action: ACTION_BUTTONS.APPROVE,
                            color: "success",
                            onClick: () => handleApproveConfirmation(i),
                          },
                          {
                            action: ACTION_BUTTONS.REJECT,
                            color: "error",
                            onClick: () => handleRejectConfirmation(i),
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
          onSave={fetchAppointments}
        />
      )}

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
