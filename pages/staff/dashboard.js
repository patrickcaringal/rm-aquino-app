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

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
      }}
    >
      <Typography gutterBottom variant="h6" component="div">
        Staff dashboard
      </Typography>
    </Box>
  );
};

export default DashboardPage;
