import * as React from "react";

import { Box, Container } from "@mui/material";

import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 240;

const MainContainer = ({ children }) => {
  const { isAdmin, isLoggedIn } = useAuth();

  return (
    <Box
      component="main"
      sx={{
        // ml: isAdmin ? "240px" : 0,
        bgcolor: "grey.100",
      }}
    >
      <Container
        component="main"
        maxWidth={isLoggedIn && isAdmin ? "none" : "lg"}
        sx={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
        }}
      >
        {children}
      </Container>
    </Box>
  );
};
export default MainContainer;
