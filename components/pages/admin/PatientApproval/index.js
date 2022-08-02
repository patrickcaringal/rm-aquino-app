import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { successMessage } from "../../../../components/common";
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
import { pluralize } from "../../../../modules/helper";
import CollapsibleRow from "./CollapsibleRow";
import RejectModal from "./rejectModal";

const defaultModal = {
  open: false,
  data: {},
};

const PatientApprovalPage = () => {
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

  const handleApprove = async (patient) => {
    // Approve
    const { error: approveError } = await approvePatient({
      patient,
    });
    if (approveError) return openErrorDialog(approveError);

    setPatients((prev) => prev.filter((i) => i.id !== patient.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Patient",
        verb: "approved",
      }),
      type: "SUCCESS",
    });
  };

  const handleReject = async (patient) => {
    // Reject
    const { error: rejectError } = await rejectPatient({
      patient,
    });
    if (rejectError) return openErrorDialog(rejectError);

    setPatients((prev) => prev.filter((i) => i.id !== patient.id));
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
                <TableCell />
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Age</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Date requested
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {patients.map((i) => (
                <CollapsibleRow
                  key={i.id}
                  data={i}
                  onApprove={handleApprove}
                  onReject={handleRejectModalOpen}
                />
              ))}
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
