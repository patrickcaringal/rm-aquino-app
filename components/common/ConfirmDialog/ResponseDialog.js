import React from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DangerousIcon from "@mui/icons-material/Dangerous";
import HelpIcon from "@mui/icons-material/Help";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export const DIALOG_TYPES = {
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
  ERROR: "ERROR",
  CONFIRM: "CONFIRM",
};

const dialogIcons = {
  [DIALOG_TYPES.SUCCESS]: (
    <CheckCircleIcon sx={{ mr: 3, fontSize: 60 }} color="success" />
  ),
  [DIALOG_TYPES.WARNING]: (
    <WarningIcon sx={{ mr: 3, fontSize: 60 }} color="warning" />
  ),
  [DIALOG_TYPES.ERROR]: (
    <DangerousIcon sx={{ mr: 3, fontSize: 60 }} color="error" />
  ),
  [DIALOG_TYPES.CONFIRM]: (
    <HelpIcon sx={{ mr: 3, fontSize: 60 }} color="primary" />
  ),
};

export default function AlertDialog({
  open,
  type = DIALOG_TYPES.SUCCESS,
  title,
  content,
  actions,
  onClose,
}) {
  const handleClose = () => {
    onClose();
  };

  const getDialogIcon = () => dialogIcons[type];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="alert-dialog-title">{title || type}</DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{
            display: "flex",
            alignItems: "center",
            // border: "1px solid red",
          }}
        >
          {getDialogIcon()}
          <Box sx={{ wordBreak: "break-word" }}>{content}</Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {actions}
        <Button onClick={handleClose} size="small">
          close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
