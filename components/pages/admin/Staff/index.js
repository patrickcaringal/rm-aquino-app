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

import { Input, successMessage } from "../../../../components/common";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, useRequest } from "../../../../hooks";
import {
  addStaffReq,
  getStaffsReq,
  updateStaffReq,
} from "../../../../modules/firebase";
import {
  formatTimeStamp,
  getFullName,
  localUpdateDocs,
  personBuiltInFields,
  pluralize,
} from "../../../../modules/helper";
import ManageStaffModal from "./ManageStaffModal";

const defaultModal = {
  open: false,
  data: {},
};

const DashboardPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getStaffs] = useRequest(getStaffsReq, setBackdropLoader);
  const [addStaff] = useRequest(addStaffReq, setBackdropLoader);
  const [updateStaff] = useRequest(updateStaffReq, setBackdropLoader);

  // Local States
  const [staffs, setStaffs] = useState([]);
  const [staffModal, setStaffModal] = useState(defaultModal);
  const filtering = useFilter({});

  useEffect(() => {
    const fetch = async () => {
      // Get Staffs
      const { data: staffList, error: getStaffsError } = await getStaffs();
      if (getStaffsError) return openErrorDialog(getStaffsError);

      setStaffs(staffList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filtering.setData(staffs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffs]);

  const handleAddStaff = async (docs) => {
    docs = docs.map((i) => ({
      ...i,
      ...personBuiltInFields(i),
    }));

    // Add Staff
    const payload = { docs };
    const { data: newDocs, error: addError } = await addStaff(payload);
    if (addError) return openErrorDialog(addError);

    // Successful
    setStaffs((prev) => [...prev, ...newDocs]);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Staff", newDocs.length),
        verb: "added",
      }),
      type: "SUCCESS",
      closeCb() {
        setStaffModal(defaultModal);
      },
    });
  };

  const handleEditStaff = async (updatedDocs) => {
    const updatedStaff = {
      ...updatedDocs[0],
      ...personBuiltInFields(updatedDocs[0]),
    };

    const { latestDocs, updates } = localUpdateDocs({
      updatedDoc: updatedStaff,
      oldDocs: [...staffs],
    });

    // TODO: change email
    // const isEmailUpdated = !lodash.isEqual(
    //   staffs[index].email,
    //   updatedStaff.email
    // );

    // Update
    const { error: updateError } = await updateStaff({
      staff: updates,
    });
    if (updateError) return openErrorDialog(updateError);

    // Success
    setStaffs(latestDocs);
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
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <Input
          label="Search"
          value={filtering.filters.name}
          onChange={(e) => {
            filtering.onNameChange(e?.target?.value);
          }}
          sx={{ width: 300, mr: 2 }}
        />
        <Button variant="contained" size="small" onClick={handleAddModalOpen}>
          add staff
        </Button>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtering.filtered.map((i) => {
              const {
                id,
                firstName,
                suffix,
                lastName,
                middleName,
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
                    <IconButton
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
                    </IconButton>
                    {/* <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleEditModalOpen({
                            ...i,
                            birthdate: formatTimeStamp(birthdate),
                          })
                        }
                      >
                        <DeleteIcon />
                      </IconButton> */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

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
