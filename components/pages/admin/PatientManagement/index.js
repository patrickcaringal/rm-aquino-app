import React, { useEffect, useState } from "react";

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

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { getPatientsReq } from "../../../../modules/firebase";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";
import {
  ACTION_BUTTONS,
  LongTypography,
  getActionButtons,
} from "../../../common";
import PatientRecordModal from "./PatientRecordModal";

const defaultModal = {
  open: false,
  data: {},
};

const PatientListPage = () => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(getPatientsReq, setBackdropLoader);
  const [patientRecordModal, setpatientRecordModal] = useState(defaultModal);

  // Local States
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      // Get Staffs
      const { data: patientList, error: getPatientError } = await getPatients();
      if (getPatientError) return openErrorDialog(getPatientError);

      setPatients(patientList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePatientRecordOpen = (data) => {
    setpatientRecordModal({
      open: true,
      data,
    });
  };

  const handlePatientRecordClose = (data) => {
    setpatientRecordModal(defaultModal);
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  { text: "Name" },
                  { text: "Age", sx: { width: 100 }, align: "center" },
                  { text: "Birthdate", sx: { width: 140 } },
                  { text: "Gender", sx: { width: 100 } },
                  { text: "Contact No.", sx: { width: 140 } },
                  { text: "Email", sx: { width: 260 } },
                  { text: "Address", sx: { width: 400 } },
                  { text: "Actions", sx: { width: 100 }, align: "center" },
                ].map(({ text, align, sx = {} }) => (
                  <TableCell
                    key={text}
                    {...(align && { align })}
                    sx={{ ...sx, fontWeight: "bold", p: 2 }}
                  >
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {patients.map((i) => {
                const {
                  id,
                  name,
                  dateCreated,
                  birthdate,
                  gender,
                  contactNo,
                  email,
                  address,
                } = i;

                return (
                  <TableRow key={id}>
                    <TableCell>{name}</TableCell>
                    <TableCell align="center">
                      {calculateAge(formatTimeStamp(birthdate))}
                    </TableCell>
                    <TableCell>
                      {formatTimeStamp(birthdate, "MMM-dd-yyyy")}
                    </TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {gender}
                    </TableCell>
                    <TableCell>{contactNo}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>
                      <LongTypography text={address} displayedLines={2} />
                    </TableCell>
                    <TableCell align="center">
                      {getActionButtons([
                        {
                          action: ACTION_BUTTONS.DETAILS,
                          color: "success",
                          onClick: () => handlePatientRecordOpen(i),
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

      {patientRecordModal.open && (
        <PatientRecordModal
          open={patientRecordModal.open}
          data={patientRecordModal.data}
          onClose={handlePatientRecordClose}
        />
      )}
    </Box>
  );
};

export default PatientListPage;
