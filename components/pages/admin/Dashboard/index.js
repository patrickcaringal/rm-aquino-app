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

const DashboardPage = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        // height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "center",
        py: 3,
        // px: 2,
      }}
    >
      <Card sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        <CardContent sx={{ minWidth: 180 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateAreas: `
                'icon text1'
                'icon text2'
            `,
            }}
          >
            <Box
              sx={{
                gridArea: "icon",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <TodayIcon sx={{ fontSize: 100 }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight="400"
              sx={{ gridArea: "text1" }}
            >
              {formatTimeStamp(new Date(), "MMM dd, yyyy")}
            </Typography>
            <Typography variant="h5" sx={{ gridArea: "text2" }}>
              {formatTimeStamp(new Date(), "EEEE")}
            </Typography>
          </Box>
        </CardContent>

        <Divider orientation="vertical" flexItem />
        <CardContent sx={{ minWidth: 180 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateAreas: `
                'icon text1'
                'icon text2'
            `,
            }}
          >
            <Box
              sx={{
                gridArea: "icon",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <PersonIcon sx={{ fontSize: 100 }} />
            </Box>
            <Typography
              variant="h2"
              fontWeight="400"
              sx={{ gridArea: "text1" }}
            >
              50
            </Typography>
            <Typography variant="h5" sx={{ gridArea: "text2" }}>
              Patients
            </Typography>
          </Box>
        </CardContent>
        <Divider orientation="vertical" flexItem />
        <CardContent sx={{ minWidth: 180 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateAreas: `
                'icon text1'
                'icon text2'
            `,
            }}
          >
            <Box
              sx={{
                gridArea: "icon",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <SupervisorAccountIcon sx={{ fontSize: 100 }} />
            </Box>
            <Typography
              variant="h2"
              fontWeight="400"
              sx={{ gridArea: "text1" }}
            >
              7
            </Typography>
            <Typography variant="h5" sx={{ gridArea: "text2" }}>
              Staffs
            </Typography>
          </Box>
        </CardContent>
        <Divider orientation="vertical" flexItem />
        <CardContent sx={{ minWidth: 180 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateAreas: `
                'icon text1'
                'icon text2'
            `,
            }}
          >
            <Box
              sx={{
                gridArea: "icon",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <SupervisorAccountIcon sx={{ fontSize: 100 }} />
            </Box>
            <Typography
              variant="h2"
              fontWeight="400"
              sx={{ gridArea: "text1" }}
            >
              10
            </Typography>
            <Typography variant="h5" sx={{ gridArea: "text2" }}>
              Doctors
            </Typography>
          </Box>
        </CardContent>
        {/* <CardContent
          sx={{
            minWidth: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5">Doctor schedule today</Typography>
          <Typography variant="h4">01:00PM - 12:00PM</Typography>
        </CardContent> */}
      </Card>
    </Box>
  );
};

export default DashboardPage;
