import React, { useEffect, useState } from "react";

import HomeIcon from "@mui/icons-material/Home";
import { Box, Breadcrumbs, Link, Toolbar, Typography } from "@mui/material";

const ToolbarComponent = ({ children, onRootClick, paths = [] }) => {
  const handleRootClick = (e) => {
    e.preventDefault();
    onRootClick();
  };

  return (
    <Toolbar disableGutters>
      <Box sx={{ flexGrow: 1 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            href="#"
            underline="hover"
            color="inherit"
            onClick={handleRootClick}
          >
            <HomeIcon sx={{ mt: "4px" }} />
          </Link>

          {paths.map(({ text }, index) => (
            <Typography key={index} color="text.primary">
              {text}
            </Typography>
          ))}
        </Breadcrumbs>
      </Box>
      {children}
    </Toolbar>
  );
};

export default ToolbarComponent;
