import React, { useEffect, useState } from "react";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FlakyIcon from "@mui/icons-material/Flaky";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Typography } from "@mui/material";

const ICONS = {
  approved: <CheckCircleOutlineIcon color="success" fontSize="small" />,
  rejected: <HighlightOffIcon color="error" fontSize="small" />,
  forapproval: <FlakyIcon color="warning" fontSize="small" />,
};

const RequestStatusIcon = ({ status, text = "" }) => {
  const statusKey = status.toLowerCase().replace(" ", "");

  return (
    <Typography
      variant="body2"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        textTransform: "capitalize",
      }}
    >
      {ICONS[statusKey]}
      {text || status}
    </Typography>
  );
};

export default RequestStatusIcon;
