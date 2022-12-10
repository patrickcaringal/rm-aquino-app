import React, { useState } from "react";

import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import { getBaseApi } from "../../../../modules/env";
import { formatTimeStamp } from "../../../../modules/helper";
import {
  ACTION_BUTTONS,
  Datalist,
  LongTypography,
  Modal,
  PdfFrame,
  TablePlaceholder,
  getActionButtons,
} from "../../../common";

const RecordDetailModal = ({ open = false, data, onClose }) => {
  const { openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Local States

  const {
    id,
    date,
    startTime,
    endTimeEstimate,
    patientName,
    patientId,
    service,
    doctor,
    diagnosis,
    medications,
    remarks,
    // vitals
    bodyTemperature,
    pulseRate,
    bloodPressure,
    height,
    weight,
  } = data;

  const appointmentData = [
    {
      label: "Appointment Date",
      value: formatTimeStamp(date, "MMM dd, yyyy (EEEE)"),
    },
    {
      label: "Appointment Time",
      value: `${startTime} - ${endTimeEstimate}`,
    },
    {
      label: "Service",
      value: `${service}`,
    },
    {
      label: "Patient Name",
      value: patientName,
    },
    // {
    //   label: "Age",
    //   value: birthdate ? calculateAge(formatTimeStamp(birthdate)) : "-",
    // },
    // {
    //   label: "Gender",
    //   value: gender ? gender : "-",
    // },
    {
      label: "Body Temperature",
      value: bodyTemperature ? `${bodyTemperature} °C` : "-",
    },
    {
      label: "Pulse Rate",
      value: pulseRate ? `${pulseRate} beats per minute` : "-",
    },
    {
      label: "Blood Pressure",
      value: bloodPressure ? bloodPressure : "-",
    },
    {
      label: "Height",
      value: height ? `${height} cm` : "-",
    },
    {
      label: "Weight",
      value: weight ? `${weight} kg` : "-",
    },
  ];

  const diagnosisData = [
    {
      label: "Doctor",
      value: doctor || "-",
    },
    {
      label: "Diagnosis",
      value: diagnosis || "-",
    },
  ];

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      // fullScreen
      open={open}
      onClose={handleClose}
      title="Record Detail"
      maxWidth="lg"
      // maxWidth="100%"
      dialogActions={
        <>
          <Button color="inherit" size="small" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="contained" size="small" onClick={submitForm}>
            save diagnosis
          </Button> */}
        </>
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Patient Details */}
        <Box>
          <Box sx={{ pr: 3, width: 480 }}>
            <Datalist data={appointmentData} labelWidth={150} />
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />

        <Box sx={{ px: 2 }}>
          <Datalist data={diagnosisData} />
          <Typography variant="body1" fontWeight="500" sx={{ my: 1 }}>
            Medications
          </Typography>

          <ul style={{ margin: 0 }}>
            {medications?.map((i, index) => (
              <li key={index}>
                <Typography>
                  {i.name} {i.dosage}, {i.frequency}
                </Typography>
                {!!i.remarks && (
                  <Typography variant="body2" fontStyle="italic">
                    {i.remarks}
                  </Typography>
                )}
              </li>
            ))}
          </ul>

          {!!remarks && (
            <>
              <Typography variant="body1" fontWeight="500" sx={{ my: 1 }}>
                Other Remarks
              </Typography>
              <Typography>{remarks}</Typography>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default RecordDetailModal;
