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

import { successMessage } from "../../../../components/common";
import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addStaffReq,
  approvePatientReq,
  getPatientsAccountApprovalReq,
  rejectPatientReq,
  updateStaffReq,
} from "../../../../modules/firebase";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";
import CollapsibleRow from "./CollapsibleRow";
import RejectModal from "./rejectModal";

const defaultModal = {
  open: false,
  data: {},
};

const PatientApprovalPage = () => {
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(
    getPatientsAccountApprovalReq,
    setBackdropLoader
  );
  const [approvePatient] = useRequest(approvePatientReq, setBackdropLoader);
  const [rejectPatient] = useRequest(rejectPatientReq, setBackdropLoader);

  // Local States
  const [patients, setPatients] = useState([]);
  const [rejectModal, setRejectModal] = useState(defaultModal);

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

  const handleApprove = async (document) => {
    // Approve
    const payload = { document: { ...document, approvedBy: user.id } };
    const { error: approveError } = await approvePatient(payload);
    if (approveError) return openErrorDialog(approveError);

    // Success
    setPatients((prev) => prev.filter((i) => i.id !== document.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Patient",
        verb: "approved",
      }),
      type: "SUCCESS",
    });
  };

  const handleReject = async (document) => {
    // Reject
    const payload = { document };
    const { error: rejectError } = await rejectPatient(payload);
    if (rejectError) return openErrorDialog(rejectError);

    // Success
    setPatients((prev) => prev.filter((i) => i.id !== document.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Patient",
        verb: "rejected",
      }),
      type: "SUCCESS",
      closeCb() {
        setRejectModal(defaultModal);
      },
    });
  };

  const handleRejectModalOpen = (data) => {
    setRejectModal({
      open: true,
      data,
    });
  };

  const handleStaffModalClose = () => {
    setRejectModal(defaultModal);
  };

  return (
    <Box sx={{ pt: 2 }}>
      {/* <Box sx={{ mb: 2 }}>
        <Button variant="contained" size="small" onClick={handleAddModalOpen}>
          add staff
        </Button>
      </Box> */}

      <Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  { text: "Name" },
                  { text: "Date requested", sx: { width: 140 } },
                  { text: "Age", sx: { width: 100 }, align: "center" },
                  { text: "Birthdate", sx: { width: 140 } },
                  { text: "Gender", sx: { width: 100 } },
                  { text: "Contact No.", sx: { width: 140 } },
                  { text: "Email", sx: { width: 140 } },
                  { text: "Address" },
                  { text: "Actions", align: "center" },
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
                    <TableCell>
                      {formatTimeStamp(dateCreated, "MMM-dd-yyyy")}
                    </TableCell>

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
                    <TableCell sx={{ maxWidth: 300, height: 53 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: "2",
                          overflow: "hidden",
                        }}
                        component="div"
                      >
                        {address}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: 110 }} align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleApprove(i)}
                      >
                        <ThumbUpIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRejectModalOpen(i)}
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
          onClose={handleStaffModalClose}
          onReject={handleReject}
        />
      )}
    </Box>
  );
};

export default PatientApprovalPage;
