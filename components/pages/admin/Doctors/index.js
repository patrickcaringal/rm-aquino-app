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

import {
  ACTION_BUTTONS,
  PATHS,
  getActionButtons,
  successMessage,
} from "../../../../components/common";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addDoctorReq,
  getDoctorsReq,
  updateDoctorReq,
} from "../../../../modules/firebase";
import {
  arrayStringify,
  formatTimeStamp,
  localUpdateDocs,
  personBuiltInFields,
  pluralize,
} from "../../../../modules/helper";
import ManageDoctorModal from "./ManageStaffModal";

const defaultModal = {
  open: false,
  data: {},
};

const DoctorsPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getDoctors] = useRequest(getDoctorsReq, setBackdropLoader);
  const [addDoctor] = useRequest(addDoctorReq, setBackdropLoader);
  const [updateDoctor] = useRequest(updateDoctorReq, setBackdropLoader);

  // Local States
  const [doctors, setDoctors] = useState([]);
  const [doctorModal, setDoctorModal] = useState(defaultModal);

  useEffect(() => {
    const fetch = async () => {
      // Get Doctors
      const { data, error: getError } = await getDoctors();
      if (getError) return openErrorDialog(getError);

      setDoctors(data);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddDoctor = async (docs) => {
    docs = docs.map((i) => ({
      ...i,
      ...personBuiltInFields(i),
    }));
    // Add Doctor
    const payload = { docs };
    const { data: newDocs, error: addError } = await addDoctor(payload);
    if (addError) return openErrorDialog(addError);

    // Successful
    setDoctors((prev) => [...prev, ...newDocs]);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Doctor", newDocs.length),
        verb: "added",
      }),
      type: "SUCCESS",
      closeCb() {
        setDoctorModal(defaultModal);
      },
    });
  };

  const handleEditDoctor = async (updatedDocs) => {
    const updated = {
      ...updatedDocs[0],
      ...personBuiltInFields(updatedDocs[0]),
    };

    const { latestDocs, updates } = localUpdateDocs({
      updatedDoc: updated,
      oldDocs: [...doctors],
    });

    // TODO: change email
    // const isEmailUpdated = !lodash.isEqual(
    //   doctors[index].email,
    //   updated.email
    // );

    console.log(JSON.stringify(updates, null, 4));
    // Update
    const { error: updateError } = await updateDoctor({
      doctor: updates,
    });
    if (updateError) return openErrorDialog(updateError);

    // Success
    setDoctors(latestDocs);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Doctor",
        verb: "updated",
      }),
      type: "SUCCESS",
      closeCb() {
        setDoctorModal(defaultModal);
      },
    });
  };

  const handleAddModalOpen = () => {
    setDoctorModal({
      open: true,
      data: null,
    });
  };

  const handleDoctorModalClose = () => {
    setDoctorModal(defaultModal);
  };

  const handleEditModalOpen = (doctor) => {
    setDoctorModal({
      open: true,
      data: doctor,
    });
  };

  const handleViewSched = (i) => {
    router.push({
      pathname: PATHS.ADMIN.DOCTORS_SCHEDULE,
      query: { id: i.id },
    });
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" size="small" onClick={handleAddModalOpen}>
          add doctor
        </Button>
      </Box>

      <Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  { text: "Name" },
                  { text: "Specialty", sx: { width: 200 } },
                  { text: "Services", sx: { width: 300 } },
                  { text: "Email", sx: { width: 200 } },
                  { text: "Birthdate", sx: { width: 140 } },
                  // { text: "Age", sx: { width: 40 }, align: "center" },
                  { text: "Gender", sx: { width: 100 } },
                  // { text: "Contact No.", sx: { width: 140 } },
                  // { text: "Address", sx: { width: 400 } },
                  { text: "Actions", sx: { width: 110 }, align: "center" },
                ].map(({ text, align, sx }) => (
                  <TableCell
                    key={text}
                    {...(align && { align })}
                    {...(sx && { sx: { ...sx, fontWeight: "bold" } })}
                  >
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {doctors.map((i) => {
                const {
                  id,
                  name,
                  gender,
                  email,
                  birthdate,
                  specialty,
                  services = [],
                } = i;

                return (
                  <TableRow key={id} id={id}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{specialty}</TableCell>
                    <TableCell>{arrayStringify(services)}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>
                      {formatTimeStamp(birthdate, "MMM-dd-yyyy")}
                    </TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {gender}
                    </TableCell>
                    <TableCell align="center">
                      {getActionButtons([
                        {
                          action: ACTION_BUTTONS.EDIT,
                          color: "success",
                          onClick: () =>
                            handleEditModalOpen({
                              ...i,
                              birthdate: formatTimeStamp(birthdate),
                              services,
                            }),
                        },
                        {
                          action: ACTION_BUTTONS.SCHEDULE,
                          color: "success",
                          onClick: () => handleViewSched(i),
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

      {doctorModal.open && (
        <ManageDoctorModal
          open={doctorModal.open}
          data={doctorModal.data}
          onClose={handleDoctorModalClose}
          onSave={!doctorModal.data ? handleAddDoctor : handleEditDoctor}
        />
      )}
    </Box>
  );
};

export default DoctorsPage;
