import React, { useEffect, useState } from "react";

import {
  Box,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  cancelAppointmentReq,
  getPatientAppointmentReq,
} from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import {
  ACTION_BUTTONS,
  DatePicker,
  LongTypography,
  Select,
  TablePlaceholder,
  getActionButtons,
  successMessage,
} from "../../../common";
import { REQUEST_STATUS, RejectModal, RequestStatus } from "../../../shared";
import useFilter from "./useFilter";

const defaultModal = {
  open: false,
  data: {},
};

const AppointmentsPage = () => {
  const { user } = useAuth();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getAppointments] = useRequest(
    getPatientAppointmentReq,
    setBackdropLoader
  );
  const [cancelAppointment] = useRequest(
    cancelAppointmentReq,
    setBackdropLoader
  );

  // Local States
  const [appointments, setAppointments] = useState([]);
  const [rejectModal, setRejectModal] = useState(defaultModal);
  const { filtered, setData, filters, onStatusChange, onDateChange } =
    useFilter({ defaultStatus: "all" });

  useEffect(() => {
    setData(appointments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments]);

  const fetchAppointment = async () => {
    // Get Appointment
    const payload = { id: user.id };
    const { data, error } = await getAppointments(payload);
    if (error) return openErrorDialog(error);

    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (document) => {
    // Reject
    const payload = { document: { ...document } };
    const { error } = await cancelAppointment(payload);
    if (error) return openErrorDialog(error);

    // Success
    fetchAppointment();
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

  const handleCancelConfirmation = (data) => {
    setRejectModal({
      open: true,
      data,
    });
  };

  const handleCancelModalClose = () => {
    setRejectModal(defaultModal);
  };

  const rejectModalContent = () => {
    const { patientName, date, startTime, endTimeEstimate } = rejectModal.data;
    return (
      <>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to cancel appointment?
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
            <MenuItem value="done" dense>
              Done
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
                  { text: "Appointment Date", sx: { width: 180 } },
                  { text: "Appointment Time", sx: { width: 180 } },
                  { text: "Doctor / Service", sx: { width: 360 } },
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
                  dateCreated,
                  startTime,
                  endTimeEstimate,
                  status,
                  doctor,
                  service,
                  reason,
                } = i;

                return (
                  <TableRow key={id} id={id}>
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
                      {doctor} <br />
                      {service}
                    </TableCell>
                    <TableCell>
                      {[
                        REQUEST_STATUS.rejected,
                        REQUEST_STATUS.cancelled,
                      ].includes(status) ? (
                        <Tooltip title={reason}>
                          <RequestStatus status={status} />
                        </Tooltip>
                      ) : (
                        <RequestStatus status={status} />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {[
                        REQUEST_STATUS.forapproval,
                        REQUEST_STATUS.approved,
                      ].includes(status) &&
                        getActionButtons([
                          {
                            action: ACTION_BUTTONS.CANCEL,
                            color: "error",
                            onClick: () => handleCancelConfirmation(i),
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

      {rejectModal.open && (
        <RejectModal
          open={rejectModal.open}
          data={rejectModal.data}
          content={rejectModalContent()}
          title="Cancel Appointment"
          onClose={handleCancelModalClose}
          onReject={handleCancel}
        />
      )}
    </Box>
  );
};

export default AppointmentsPage;
