import React, { useEffect, useState } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import RuleIcon from "@mui/icons-material/Rule";
import { Typography } from "@mui/material";

const ICONS = {
  approved: <CheckCircleOutlineIcon color="success" fontSize="small" />,
  done: <CheckCircleIcon color="success" fontSize="small" />,
  rejected: <HighlightOffIcon color="error" fontSize="small" />,
  forapproval: <RuleIcon color="warning" fontSize="small" />,
};

export const REQUEST_STATUS = {
  approved: "approved",
  done: "done",
  rejected: "rejected",
  forapproval: "forapproval",
};

const REQUEST_DICTIONARY = {
  approved: "approved",
  done: "done",
  rejected: "rejected",
  forapproval: "for approval",
};

const RequestStatusIcon = ({ status = "", text = "" }) => {
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
      {text || REQUEST_DICTIONARY[status]}
    </Typography>
  );
};

export default RequestStatusIcon;
