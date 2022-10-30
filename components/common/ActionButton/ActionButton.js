import React from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import InfoIcon from "@mui/icons-material/Info";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import RestoreIcon from "@mui/icons-material/Restore";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { IconButton, Tooltip } from "@mui/material";

export const ACTION_BUTTONS = {
  DETAILS: "DETAILS",
  EDIT: "EDIT",
  DELETE: "DELETE",
  RESTORE: "RESTORE",
  // specific
  SCHEDULE: "SCHEDULE",
  DIAGNOSE: "DIAGNOSE",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  CANCEL: "CANCEL",
};

export const ACTION_ICONS = {
  DETAILS: <FolderSharedIcon />,
  EDIT: <EditIcon />,
  DELETE: <DeleteIcon />,
  RESTORE: <RestoreIcon />,
  SCHEDULE: <CalendarMonthIcon />,
  INFO: <InfoIcon />,
  DIAGNOSE: <RecordVoiceOverIcon />,
  APPROVE: <ThumbUpIcon />,
  REJECT: <ThumbDownIcon />,
  CANCEL: <EventBusyIcon />,
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
