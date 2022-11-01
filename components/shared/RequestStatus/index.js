import React, { useEffect, useState } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import RuleIcon from "@mui/icons-material/Rule";
import { Typography } from "@mui/material";

const ICONS = {
  forapproval: <RuleIcon color="warning" fontSize="small" />,
  approved: <CheckCircleOutlineIcon color="success" fontSize="small" />,
  done: <CheckCircleIcon color="success" fontSize="small" />,
  rejected: <HighlightOffIcon color="error" fontSize="small" />,
  cancelled: <EventBusyIcon color="error" fontSize="small" />,
};

export const REQUEST_STATUS = {
  forapproval: "forapproval",
  approved: "approved",
  done: "done",
  rejected: "rejected",
  cancelled: "cancelled",
};

const REQUEST_DICTIONARY = {
  forapproval: "for approval",
  approved: "approved",
  done: "done",
  rejected: "rejected",
  cancelled: "cancelled",
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
