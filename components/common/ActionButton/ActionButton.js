import React from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import InfoIcon from "@mui/icons-material/Info";
import RestoreIcon from "@mui/icons-material/Restore";
import { IconButton, Tooltip } from "@mui/material";

export const ACTION_BUTTONS = {
  DETAILS: "DETAILS",
  EDIT: "EDIT",
  DELETE: "DELETE",
  RESTORE: "RESTORE",
  // specific
  SCHEDULE: "SCHEDULE",
};

export const ACTION_ICONS = {
  DETAILS: <FolderSharedIcon />,
  EDIT: <EditIcon />,
  DELETE: <DeleteIcon />,
  RESTORE: <RestoreIcon />,
  SCHEDULE: <CalendarMonthIcon />,
  INFO: <InfoIcon />,
};

const getButton = ({
  tooltipText = "",
  action,
  color = "default",
  onClick,
}) => {
  return (
    <IconButton size="small" onClick={onClick} color={color}>
      {ACTION_ICONS[action]}
    </IconButton>
  );
};

export const getActionButtons = (actions) => {
  return actions.map((i) => getButton(i));
};
