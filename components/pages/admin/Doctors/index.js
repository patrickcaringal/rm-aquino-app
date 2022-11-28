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
  Input,
  PATHS,
  getActionButtons,
  successMessage,
} from "../../../../components/common";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, useRequest } from "../../../../hooks";
import {
  addDoctorReq,
  getDoctorsReq,
  getServicesReq,
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
  const [getServices] = useRequest(getServicesReq, setBackdropLoader);
  const [addDoctor] = useRequest(addDoctorReq, setBackdropLoader);
  const [updateDoctor] = useRequest(updateDoctorReq, setBackdropLoader);

  // Local States
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [doctorModal, setDoctorModal] = useState(defaultModal);
  const filtering = useFilter({});

  useEffect(() => {
    const fetch = async () => {
      // Get Doctors
      const { data, error: getError } = await getDoctors();
      if (getError) return openErrorDialog(getError);

      setDoctors(data);
    };

    const fetchServices = async () => {
      // Get Services
      const { data, map, error } = await getServices();
      if (error) return openErrorDialog(error);

      setServices(data);
      setServicesMap(map);
    };

    fetch();
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filtering.setData(doctors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors]);

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
          add doctor
        </Button>
      </Box>

      <Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  { text: "Name", sx: { width: 400 } },
                  { text: "Specialty", sx: { width: 200 } },
                  { text: "Services" },
                  { text: "Email", sx: { width: 200 } },
                  // { text: "Birthdate", sx: { width: 140 } },
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
              {filtering.filtered.map((i) => {
                const {
                  id,
                  name,
                  gender,
                  email,
                  birthdate,
                  specialty,
                  services = [],
                } = i;
                const data = {
                  ...i,
                  services: i.servicesId.map((s) => servicesMap[s]),
                };

                return (
                  <TableRow key={id} id={id}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{specialty}</TableCell>
                    <TableCell>{arrayStringify(data.services)}</TableCell>
                    <TableCell>{email}</TableCell>
                    {/* <TableCell>
                      {formatTimeStamp(birthdate, "MMM-dd-yyyy")}
                    </TableCell> */}
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
                              ...data,
                              birthdate: formatTimeStamp(birthdate),
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
          services={services}
          onClose={handleDoctorModalClose}
          onSave={!doctorModal.data ? handleAddDoctor : handleEditDoctor}
        />
      )}
    </Box>
  );
};

export default DoctorsPage;
