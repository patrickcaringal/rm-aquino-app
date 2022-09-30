import React, { useEffect, useState } from "react";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";

const EmailVerification = () => {
  const router = useRouter();

  const id = router.query.id;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 80px - 40px - 100px)",
        //   border: "1px solid red",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        patrickcaringalreal@gmail.com
      </Typography>
      <Button variant="contained" size="large" onClick={() => {}}>
        Verify Email
      </Button>
    </Box>
  );
};

export default EmailVerification;
