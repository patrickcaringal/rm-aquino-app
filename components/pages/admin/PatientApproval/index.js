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
  updateStaffReq,
} from "../../../../modules/firebase";
import { pluralize } from "../../../../modules/helper";
import CollapsibleRow from "./CollapsibleRow";
import ManageStaffModal from "./ManageStaffModal";

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
  const [addStaff] = useRequest(addStaffReq, setBackdropLoader);
  const [updateStaff] = useRequest(updateStaffReq, setBackdropLoader);
  const [approvePatient] = useRequest(approvePatientReq, setBackdropLoader);

  // Local States
  const [patients, setPatients] = useState([]);
  const [staffModal, setStaffModal] = useState(defaultModal);

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

  const handleReject = (data) => {
    console.log(data);
  };

  const handleAddStaff = async (newStaff) => {
    // Add Staff
    const { data: addedStaff, error: addStaffError } = await addStaff({
      patients: newStaff,
    });
    if (addStaffError) return openErrorDialog(addStaffError);

    // Successful
    setPatients((prev) => [...prev, ...addedStaff]);

    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Staff", addedStaff.length),
        verb: "added",
      }),
      type: "SUCCESS",
      closeCb() {
        setStaffModal(defaultModal);
      },
    });
  };

  const handleEditStaff = async (updatedDocs) => {
    const updatedStaff = updatedDocs[0];
    const staffCopy = [...patients];
    const index = staffCopy.findIndex((i) => i.id === updatedStaff.id);

    staffCopy[index] = {
      ...staffCopy[index],
      ...updatedStaff,
    };

    // TODO: change email
    // const isEmailUpdated = !lodash.isEqual(
    //   patients[index].email,
    //   updatedStaff.email
    // );

    // Update
    const { error: updateError } = await updateStaff({
      staff: updatedStaff,
    });
    if (updateError) return openErrorDialog(updateError);

    // Success
    setPatients(staffCopy);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Staff",
        verb: "updated",
      }),
      type: "SUCCESS",
      closeCb() {
        setStaffModal(defaultModal);
      },
    });
  };

  const handleAddModalOpen = () => {
    setStaffModal({
      open: true,
      data: null,
    });
  };

  const handleStaffModalClose = () => {
    setStaffModal(defaultModal);
  };

  const handleEditModalOpen = (staff) => {
    setStaffModal({
      open: true,
      data: staff,
    });
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
                  onReject={handleReject}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* {staffModal.open && (
        <ManageStaffModal
          open={staffModal.open}
          data={staffModal.data}
          onClose={handleStaffModalClose}
          onSave={!staffModal.data ? handleAddStaff : handleEditStaff}
        />
      )} */}
    </Box>
  );
};

export default PatientApprovalPage;
