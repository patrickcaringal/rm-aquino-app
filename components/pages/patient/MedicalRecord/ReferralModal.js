import React from "react";

import { Box, Button } from "@mui/material";

import { Modal, PdfFrame } from "../../../common";

const ReferralModal = ({ open = false, data, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Referral"
      maxWidth="lg"
      // maxWidth="100%"
      dialogActions={
        <Button color="inherit" size="small" onClick={handleClose}>
          Close
        </Button>
      }
    >
      <Box>
        <PdfFrame src={`${data}`} width="100%" height="600" />
      </Box>
    </Modal>
  );
};

export default ReferralModal;
