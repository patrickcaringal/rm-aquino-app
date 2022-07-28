import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import faker from "faker";
import { useRouter } from "next/router";

import { Toolbar } from "../../../../components/common";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { addStaffReq, getStaffsReq } from "../../../../modules/firebase";
import { getFullName, pluralize } from "../../../../modules/helper";
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

  // Local States
  const [staffs, setStaffs] = useState([
    // ...[...Array(2)].map((i) => ({
    //   id: faker.datatype.uuid(),
    //   firstName: faker.name.firstName(),
    //   suffix: "",
    //   lastName: faker.name.lastName(),
    //   middleName: faker.name.lastName(),
    //   email: faker.internet.email(),
    //   address: faker.lorem.paragraph(),
    //   birthdate: faker.date.past(),
    //   gender: faker.random.arrayElements(["male", "female"]),
    // })),
  ]);
  const [staffModal, setStaffModal] = useState(defaultModal);

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

  const handleStaffModalOpen = () => {
    setStaffModal({
      open: true,
      data: null,
    });
  };

  const handleAddStaff = async (newStaff) => {
    // Add Staff
    const { data: addedStaff, error: addStaffError } = await addStaff({
      staffs: newStaff,
    });
    if (addStaffError) return openErrorDialog(addStaffError);

    // Successful
    setStaffs((prev) => [...prev, ...addedStaff]);

    openResponseDialog({
      autoClose: true,
      content: `${pluralize("Staff", addedStaff.length)} successfuly added.`,
      type: "SUCCESS",
      closeCb() {
        setStaffModal(defaultModal);
      },
    });
  };

  const handleStaffModalClose = () => {
    setStaffModal(defaultModal);
  };

  return (
    <Box
      sx={{
        // height: "calc(100vh - 64px)",
        bgColor: "secondary",
        pt: 2,
      }}
    >
      <Button variant="contained" size="small" onClick={handleStaffModalOpen}>
        add staff
      </Button>

      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {staffs.map((i) => {
                const {
                  id,
                  firstName,
                  suffix,
                  lastName,
                  middleName,
                  email,
                  branch,
                  address,
                } = i;

                return (
                  <TableRow key={id}>
                    <TableCell>
                      {getFullName({
                        firstName,
                        suffix,
                        lastName,
                        middleName,
                      })}
                    </TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
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
                    <TableCell></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ManageStaffModal
        open={staffModal.open}
        onClose={handleStaffModalClose}
        // onCheckDuplicate={handleCheckDuplicate}
        onSave={handleAddStaff}
      />
    </Box>
  );
};

export default DashboardPage;
