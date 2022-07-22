import React from "react";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

const DashboardPage = () => {
  const router = useRouter();

  // 296 * 208
  // Manage family members
  // View family records
  //

  // sx={{ mt: 300 }}
  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        rowGap: 3,
        columnGap: 3,
      }}
    >
      <Card sx={{ width: 296, height: 208 }}>
        <CardActionArea
          sx={{ width: "inherit", height: "inherit" }}
          onClick={() => {
            router.push("/family-members");
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Manage Family
              <br />
              Members
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <Card sx={{ width: 296, height: 208 }}>
        <CardActionArea sx={{ width: "inherit", height: "inherit" }}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ textAlign: "center" }}
            >
              View Family
              <br />
              Records
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <Card sx={{ width: 296, height: 208 }}>
        <CardActionArea sx={{ width: "inherit", height: "inherit" }}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Get Queue
              <br />
              Number
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default DashboardPage;
