import React from "react";

import { Box, Button, ButtonGroup, Typography } from "@mui/material";

import { DATE_FORMAT, formatTimeStamp } from "../../../../modules/helper";

const Header = ({ selectedDate, handleCalendarPrev, handleCalendarNext }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6" fontWeight={500}>
        {formatTimeStamp(new Date(selectedDate), DATE_FORMAT.monthyear)}
      </Typography>

      <ButtonGroup size="small">
        <Button onClick={handleCalendarPrev}>Prev</Button>
        <Button onClick={handleCalendarNext}>Next</Button>
      </ButtonGroup>
    </Box>
  );
};

export default Header;
