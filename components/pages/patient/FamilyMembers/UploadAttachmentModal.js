import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";

import { getFullName } from "../../../../modules/helper";

const UploadAttachmentModal = ({ data, open, onClose, onUpload }) => {
  const isMobileView = useMediaQuery((theme) => theme.breakpoints.only("xs"));

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const hasImage = selectedFile && preview;

  const handleUpload = () => {
    onUpload(selectedFile);
  };

  const handleClose = () => {
    onClose();
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelectedFile(undefined);
        setPreview(undefined);
      }, 500);
    }
  }, [open]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <Dialog
      fullScreen={isMobileView}
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="alert-dialog-title">
        Upload Verification Attachment
      </DialogTitle>
      <DialogContent sx={{ overflow: "overlay" }}>
        <Typography sx={{ mb: 2 }} variant="body2">
          {getFullName(data)}
        </Typography>
        <Box
          sx={{
            height: "auto",
            width: "auto",
            ...(!hasImage && { bgcolor: "grey.A400" }),
          }}
        >
          <Image
            src={hasImage ? preview : "/placeholder-image.png"}
            alt=""
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="contain"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label>
            <Input
              sx={{ display: "none" }}
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={onSelectFile}
            />
            <Button variant="contained" component="span" sx={{ mt: 2 }}>
              choose image
            </Button>
          </label>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleUpload}>Upload</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadAttachmentModal;
