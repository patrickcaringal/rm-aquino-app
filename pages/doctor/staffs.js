import React, { useEffect, useState } from "react";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
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
import { useRouter } from "next/router";

import { Toolbar } from "../../components/common";
import { ManageStaffModal } from "../../components/pages/doctor/StaffManagement";
import { useBackdropLoader } from "../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../contexts/ResponseDialogContext";
import useRequest from "../../hooks/useRequest";
import { addStaffReq, getStaffsReq } from "../../modules/firebase";
import { getFullName, getUniquePersonId } from "../../modules/helper";

const DashboardPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getStaffs] = useRequest(getStaffsReq, setBackdropLoader);
  const [addStaff] = useRequest(addStaffReq, setBackdropLoader);

  // Local States
  const [staffs, setStaffs] = useState([]);
  const [staffModalOpen, setStaffModalOpen] = useState(false);

  const staffsUniqueId = staffs.map((i) => {
    const { firstName, middleName, lastName, birthdate } = i;
    const m = getUniquePersonId({ firstName, middleName, lastName, birthdate });
    return m;
  });

  useEffect(() => {
    const fetch = async () => {
      // Get Staffs
      const { data: staffList, error: getStaffsError } = await getStaffs({
        branch: "LAKESIDE",
      });
      if (getStaffsError) return openErrorDialog(getStaffsError);

      setStaffs(staffList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStaffModalOpen = () => {
    setStaffModalOpen(true);
  };

  const handleCheckDuplicate = (newStaff) => staffsUniqueId.includes(newStaff);

  const handleAddStaff = async (newStaff) => {
    // Add Staff
    const { error: addStaffError } = await addStaff({
      staffs: newStaff,
    });
    if (addStaffError) return openErrorDialog(addStaffError);

    // Successful
    const allStaffs = [...staffs, ...newStaff];
    setStaffs(allStaffs);

    openResponseDialog({
      autoClose: true,
      content: "Staff successfuly added.",
      type: "SUCCESS",
      closeCb() {
        setStaffModalOpen(false);
      },
    });
  };

  const handleSendEmail = () => {};

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        mx: 4,
      }}
    >
      <Toolbar
        onRootClick={() => router.push("/doctor/dashboard")}
        paths={[{ text: "Staffs" }]}
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleStaffModalOpen}
          startIcon={<GroupAddIcon />}
        >
          add staff
        </Button>
      </Toolbar>
      <Box>
        <Paper
          elevation={2}
          sx={{ height: "calc(100vh - 64px - 64px - 16px)" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
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
                      <TableCell>{branch}</TableCell>
                      <TableCell>
                        {/* <IconButton
                            color="primary"
                            component="span"
                            onClick={handleSendEmail}
                          >
                            <MailIcon />
                          </IconButton> */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <ManageStaffModal
        open={staffModalOpen}
        setOpen={setStaffModalOpen}
        onCheckDuplicate={handleCheckDuplicate}
        onAddStaff={handleAddStaff}
      />
    </Box>
  );
};

export default DashboardPage;
