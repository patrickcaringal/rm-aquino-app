import React from "react";

import { Box, Button, ButtonGroup, Typography } from "@mui/material";

import { DATE_FORMAT, formatTimeStamp } from "../../../../modules/helper";

const Header = ({ selectedDate, handleCalendarPrev, handleCalendarNext }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight={500}>
          Appointments for approval
        </Typography>

        <Typography variant="h6" fontWeight={400}>
          {formatTimeStamp(new Date(selectedDate), DATE_FORMAT.monthyear)}
        </Typography>
      </Box>

      {/* <Box>
        <ButtonGroup size="small">
          <Button onClick={handleCalendarPrev}>Prev</Button>
          <Button onClick={handleCalendarNext}>Next</Button>
        </ButtonGroup>
      </Box> */}
    </Box>
  );
};

export default Header;
