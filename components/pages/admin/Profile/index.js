import React, { useCallback, useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  Box,
  Button,
  Container,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../hooks";
import {
  addServiceReq,
  changePasswordReq,
  deleteServiceReq,
  getServicesReq,
  getUserReq,
  updateServiceReq,
  updateUserReq,
} from "../../../../modules/firebase";
import { localUpdateDocs, pluralize } from "../../../../modules/helper";
import {
  Input,
  PATHS,
  Pagination,
  confirmMessage,
  successMessage,
} from "../../../common";
import Password from "./Password";
import Profile from "./Profile";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  if (value !== index) return null;
  return <Box sx={{ p: 2, pt: 4 }}>{children}</Box>;
}

const ProfilePage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getProfile] = useRequest(getUserReq, setBackdropLoader);
  const [updateProfile] = useRequest(updateUserReq, setBackdropLoader);
  const [changePassword] = useRequest(changePasswordReq, setBackdropLoader);

  // Local States
  const [selectedTab, setSelectedTab] = useState(0);
  const [profile, setProfile] = useState({});

  const fetchProfile = async () => {
    const payload = {
      id: user.id,
      type: isAdmin ? "admins" : "patients",
    };
    const { data, error } = await getProfile(payload);
    if (error) return openErrorDialog(error);

    setProfile(data);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleProfileSave = async (updates) => {
    // Update
    const payload = {
      updates: updates,
      type: isAdmin ? "admins" : "patients",
    };
    const { error } = await updateProfile(payload);
    if (error) return openErrorDialog(error);

    // Successful
    fetchProfile();
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Profile",
        verb: "updated",
      }),
      type: "SUCCESS",
    });
  };

  const handleAccountSave = async (payload) => {
    const { error } = await changePassword(payload);
    if (error) return openErrorDialog(error);

    // Successful
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Password", verb: "updated" }),
      type: "SUCCESS",
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Profile" />
          <Tab label="Password" />
        </Tabs>
      </Box>
      <TabPanel value={selectedTab} index={0}>
        <Profile data={profile} onSave={handleProfileSave} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <Password data={profile} onSave={handleAccountSave} />
      </TabPanel>
    </Container>
  );
};

export default ProfilePage;
