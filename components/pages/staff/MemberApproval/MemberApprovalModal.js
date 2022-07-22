import React, { useEffect, useState } from "react";

import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
const ReactViewer = dynamic(() => import("react-viewer"), { ssr: false });

const MemberApprovalModal = ({ data, open, onClose, onApprove, onReject }) => {
  const { src = "", requester, member, accountId } = data || {};

  const [viewerOpen, setViewerOpen] = useState(false);
  const [rejectInputShown, setRejectInputShown] = useState(false);
  const [rejectReason, setRejectReason] = useState({
    value: "",
    error: "",
  });

  const dialogOpen = viewerOpen ? false : open;
  const image = [
    {
      src: src,
      alt: "",
    },
  ];

  const validateInput = (value) => {
    setRejectReason((prev) => ({
      ...prev,
      error: value.trim() === "" ? "Rejection reason is required" : "",
    }));
  };

  const handleViewerOpen = () => {
    setViewerOpen(true);
  };

  const handleViewerClose = () => {
    setViewerOpen(false);
  };

  const handleClose = () => {
    onClose();
    handleCancelReject();
  };

  const handleApprove = () => {
    onApprove({ memberName: member, accountId });
  };

  const handleReject = () => {
    setRejectInputShown(true);
  };

  const handleProceedReject = () => {
    validateInput(rejectReason.value);
    if (rejectReason.value === "") return;

    onReject({
      memberName: member,
      accountId,
      verificationRejectReason: rejectReason.value,
    });
  };

  const handleCancelReject = () => {
    setRejectInputShown(false);
    setRejectReason("");
  };

  return (
    <>
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle id="alert-dialog-title">
          Member Verification Approval
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Requester
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              {requester}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Member
            </Typography>
            <Typography variant="caption" display="block">
              {member}
            </Typography>
          </Box>
          <Box
            sx={{
              height: 400,
              width: 396,
            }}
          >
            {src && (
              <Image
                src={src}
                alt=""
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="contain"
              />
            )}
          </Box>
          {rejectInputShown && (
            <TextField
              size="small"
              required
              fullWidth
              label="Rejection reason"
              autoComplete="off"
              value={rejectReason.value}
              onChange={(e) =>
                setRejectReason((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              onBlur={(e) => validateInput(e.target.value)}
              error={rejectReason.error}
              helperText={rejectReason.error}
            />
          )}
          <Fab
            size="small"
            color="primary"
            sx={{ position: "absolute", bottom: 100, right: 16 }}
            onClick={handleViewerOpen}
          >
            <ImageSearchIcon />
          </Fab>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {!rejectInputShown && (
            <>
              <Button
                onClick={handleApprove}
                variant="outlined"
                color="success"
              >
                Approve
              </Button>
              <Button onClick={handleReject} variant="outlined" color="error">
                Reject
              </Button>
            </>
          )}
          {rejectInputShown && (
            <>
              <Button onClick={handleCancelReject}>Cancel</Button>
              <Button
                onClick={handleProceedReject}
                variant="outlined"
                color="error"
              >
                Proceed Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <ReactViewer
        visible={viewerOpen}
        onClose={handleViewerClose}
        images={image}
        zIndex={2000}
        zoomSpeed={0.2}
        attribute={false}
        rotatable={false}
        downloadable={false}
        scalable={false}
        changeable={false}
        loop={false}
      />
    </>
  );
};

export default MemberApprovalModal;
