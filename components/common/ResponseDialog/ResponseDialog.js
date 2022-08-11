import React from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DangerousIcon from "@mui/icons-material/Dangerous";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";

export const DIALOG_TYPES = {
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  CONFIRM: "confirm",
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

  if (type !== "CONFIRM")
    return (
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ maxWidth: 400 }}
      >
        <Alert
          // variant="filled"
          severity={DIALOG_TYPES[type]}
          sx={{ width: "100%" }}
          onClose={handleClose}
        >
          <AlertTitle>{title || type}</AlertTitle>
          <Box sx={{ wordBreak: "break-word" }}>{content}</Box>
        </Alert>
      </Snackbar>
    );

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
