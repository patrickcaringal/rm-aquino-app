import React from "react";

import { Box, Button, ButtonGroup, Typography } from "@mui/material";

import { DATE_FORMAT, formatTimeStamp } from "../../../../modules/helper";

const Header = ({
  selectedDate,
  handleCalendarPrev,
  handleCalendarNext,
  prevDisabled,
  nextDisabled,
  handleSave,
  disabledSave,
}) => {
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

      <Box sx={{ display: "flex", gap: 2 }}>
        <ButtonGroup size="small">
          <Button onClick={handleCalendarPrev} disabled={prevDisabled}>
            Prev
          </Button>
          <Button onClick={handleCalendarNext} disabled={nextDisabled}>
            Next
          </Button>
        </ButtonGroup>

        <Button
          variant="contained"
          size="small"
          onClick={handleSave}
          disabled={disabledSave}
        >
          submit appointment
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
