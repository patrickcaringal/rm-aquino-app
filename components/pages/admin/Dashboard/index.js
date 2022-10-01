import React from "react";

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

import {
  days,
  formatTimeStamp,
  getDayOfWeek,
  today,
} from "../../../../modules/helper";
import PanelItem from "./PanelItem";

const DashboardPage = () => {
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
        text: 50,
      },
      content2: {
        text: "Patients",
      },
    },
    {
      icon: <SupervisorAccountIcon sx={{ fontSize: 100 }} />,
      content1: {
        text: 7,
      },
      content2: {
        text: "Staffs",
      },
    },
    {
      icon: <SupervisorAccountIcon sx={{ fontSize: 100 }} />,
      content1: {
        text: 10,
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
