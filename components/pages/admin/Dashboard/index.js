import React, { useEffect, useState } from "react";

import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import TodayIcon from "@mui/icons-material/Today";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  getDoctorsReq,
  getPatientsReq,
  getStaffsReq,
} from "../../../../modules/firebase";
import {
  days,
  formatTimeStamp,
  getDayOfWeek,
  today,
} from "../../../../modules/helper";
import PanelItem from "./PanelItem";

const DashboardPage = () => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(getPatientsReq, setBackdropLoader);
  const [getStaffs] = useRequest(getStaffsReq, setBackdropLoader);
  const [getDoctors] = useRequest(getDoctorsReq, setBackdropLoader);

  // Local States
  const [patients, setPatients] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchPatient = async () => {
      const { data, error } = await getPatients();
      if (error) return openErrorDialog(error);

      setPatients(data);
    };

    const fetchStaff = async () => {
      const { data, error } = await getStaffs();
      if (error) return openErrorDialog(error);

      setStaffs(data);
    };

    const fetchDoctor = async () => {
      const { data, error } = await getStaffs();
      if (error) return openErrorDialog(error);

      setDoctors(data);
    };

    fetchPatient();
    fetchStaff();
    fetchDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const panelData = [
    {
      icon: <TodayIcon sx={{ fontSize: 100 }} />,
      content1: {
        text: formatTimeStamp(new Date(), "MMM dd, yyyy"),
        props: {
          variant: "h4",
          sx: { gridArea: "text1", mt: 1 },
        },
      },
      content2: {
        text: formatTimeStamp(new Date(), "EEEE"),
        props: {
          variant: "h5",
          sx: { gridArea: "text2", mt: 1 },
        },
      },
    },
    {
      icon: <PersonIcon sx={{ fontSize: 100 }} />,
      content1: {
        text: patients?.length || "-",
      },
      content2: {
        text: "Patients",
      },
    },
    {
      icon: <SupervisorAccountIcon sx={{ fontSize: 100 }} />,
      content1: {
        text: staffs?.length || "-",
      },
      content2: {
        text: "Staffs",
      },
    },
    {
      icon: <SupervisorAccountIcon sx={{ fontSize: 100 }} />,
      content1: {
        text: doctors?.length || "-",
      },
      content2: {
        text: "Doctors",
      },
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        py: 3,
      }}
    >
      <Card sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        {panelData.map((i, index) => (
          <PanelItem key={index} data={i} />
        ))}
      </Card>
    </Box>
  );
};

export default DashboardPage;
