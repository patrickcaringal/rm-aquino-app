import React from "react";

import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

const BackdropLoader = ({ open }) => (
  <Backdrop sx={{ zIndex: 2000 }} open={open}>
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <CircularProgress
        color="primary"
        size={80}
        thickness={8}
        sx={{ mb: 3 }}
      />
      <Typography variant="h6" color="common.white">
        Loading ...
      </Typography>
    </Box>
  </Backdrop>
);

export default BackdropLoader;
