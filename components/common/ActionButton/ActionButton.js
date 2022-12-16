import React from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import InfoIcon from "@mui/icons-material/Info";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import PaidIcon from "@mui/icons-material/Paid";
import PrintIcon from "@mui/icons-material/Print";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import RestoreIcon from "@mui/icons-material/Restore";
import SourceIcon from "@mui/icons-material/Source";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { IconButton, Tooltip } from "@mui/material";

export const ACTION_BUTTONS = {
  DETAILS: "DETAILS",
  DETAILS2: "DETAILS2",
  EDIT: "EDIT",
  DELETE: "DELETE",
  RESTORE: "RESTORE",
  // specific
  SCHEDULE: "SCHEDULE",
  DIAGNOSE: "DIAGNOSE",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  CANCEL: "CANCEL",
  VITALSIGN: "VITALSIGN",
  PRINT: "PRINT",
  EMAIL: "EMAIL",
  PAID: "PAID",
};

export const ACTION_ICONS = {
  DETAILS: <FolderSharedIcon />,
  DETAILS2: <SourceIcon />,
  EDIT: <EditIcon />,
  DELETE: <DeleteIcon />,
  RESTORE: <RestoreIcon />,
  SCHEDULE: <CalendarMonthIcon />,
  INFO: <InfoIcon />,
  DIAGNOSE: <RecordVoiceOverIcon />,
  APPROVE: <ThumbUpIcon />,
  REJECT: <ThumbDownIcon />,
  CANCEL: <EventBusyIcon />,
  VITALSIGN: <MonitorHeartIcon />,
  PRINT: <PrintIcon />,
  EMAIL: <EmailIcon />,
  PAID: <PaidIcon />,
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
