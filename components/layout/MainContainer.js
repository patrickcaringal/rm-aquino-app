import * as React from "react";

import { Box, Container } from "@mui/material";

import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 240;

const MainContainer = ({ children }) => {
  const { isAdminPanel } = useAuth();

  return (
    <Box
      component="main"
      sx={{
        // ml: isAdminPanel ? "240px" : 0,
        bgcolor: "grey.100",
      }}
    >
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
        }}
      >
        {children}
      </Container>
      {/* {!isAdminPanel ? (
        <Container
          component="main"
          maxWidth="lg"
          sx={{
            minHeight: "calc(100vh - 110px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {children}
        </Container>
      ) : (
        children
      )} */}
    </Box>
  );
};
export default MainContainer;
