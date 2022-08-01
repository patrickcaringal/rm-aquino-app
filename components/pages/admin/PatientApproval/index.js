import React, { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
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

import { Toolbar, successMessage } from "../../../../components/common";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addStaffReq,
  getPatientsAccountApprovalReq,
  getStaffsReq,
  updateStaffReq,
} from "../../../../modules/firebase";
import {
  formatTimeStamp,
  getFullName,
  pluralize,
} from "../../../../modules/helper";
import ManageStaffModal from "./ManageStaffModal";

const defaultModal = {
  open: false,
  data: {},
};

const DashboardPage = () => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getStaffs] = useRequest(
    getPatientsAccountApprovalReq,
    setBackdropLoader
  );
  const [addStaff] = useRequest(addStaffReq, setBackdropLoader);
  const [updateStaff] = useRequest(updateStaffReq, setBackdropLoader);

  // Local States
  const [patients, setPatients] = useState([]);
  const [staffModal, setStaffModal] = useState(defaultModal);

  useEffect(() => {
    const fetch = async () => {
      // Get Staffs
      const { data: patientList, error: getPatientError } = await getStaffs();
      if (getPatientError) return openErrorDialog(getPatientError);

      setPatients(patientList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" size="small" onClick={handleAddModalOpen}>
          add staff
        </Button>
      </Box>

      <Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {patients.map((i) => {
                const {
                  id,
                  firstName,
                  suffix,
                  lastName,
                  middleName,
                  gender,
                  email,
                  birthdate,
                  address,
                } = i;

                return (
                  <TableRow key={id}>
                    <TableCell sx={{ width: 260 }}>
                      <Typography variant="body2">
                        {getFullName({
                          firstName,
                          suffix,
                          lastName,
                          middleName,
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: 260 }}>
                      <Typography variant="body2">{email}</Typography>
                    </TableCell>
                    <TableCell sx={{ width: 260 }}>
                      <Typography variant="body2">{gender}</Typography>
                    </TableCell>

                    {/* sx={{ maxWidth: 200 }} */}
                    <TableCell>
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
                      {/* <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          handleEditModalOpen({
                            ...i,
                            birthdate: formatTimeStamp(birthdate),
                          })
                        }
                      >
                        <EditIcon />
                      </IconButton> */}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {staffModal.open && (
        <ManageStaffModal
          open={staffModal.open}
          data={staffModal.data}
          onClose={handleStaffModalClose}
          onSave={!staffModal.data ? handleAddStaff : handleEditStaff}
        />
      )}
    </Box>
  );
};

export default DashboardPage;
