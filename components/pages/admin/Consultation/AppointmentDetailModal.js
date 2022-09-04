import React from "react";

import { Box, Button, Typography } from "@mui/material";

import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { formatTimeStamp, today } from "../../../../modules/helper";
import { StaffSchema } from "../../../../modules/validation";
import { Datalist, Modal } from "../../../common";

const AppointmentDetailModal = ({ open = false, data, onClose }) => {
  const {
    id,
    date,
    startTime,
    endTimeEstimate,
    reasonAppointment,
    patientName,
  } = data;

  const appointmentData = [
    {
      label: "Patient Name",
      value: patientName,
    },
    {
      label: "Appointment Date",
      value: formatTimeStamp(date, "MMM dd, yyyy"),
    },
    {
      label: "Appointment Day",
      value: formatTimeStamp(date, "EEEE"),
    },
    {
      label: "Appointment Time",
      value: `${startTime} - ${endTimeEstimate}`,
    },
    {
      label: "Reason for Appointment",
      value: reasonAppointment,
    },
  ];

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Appointment Detail"
      maxWidth="sm"
      dialogActions={
        <Button color="inherit" onClick={handleClose}>
          Close
        </Button>
      }
    >
      <Datalist
        data={appointmentData}
        labelWidth={200}
        labelAlignment="right"
      />
    </Modal>
  );
};

export default AppointmentDetailModal;
