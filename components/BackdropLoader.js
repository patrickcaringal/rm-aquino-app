import React from "react";

import { Backdrop, CircularProgress } from "@mui/material";

const BackdropLoader = ({ open }) => (
  <Backdrop sx={{ color: "#fff", zIndex: 2000 }} open={open}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

export default BackdropLoader;
