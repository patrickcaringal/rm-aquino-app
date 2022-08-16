import React from "react";

import { Box, Typography } from "@mui/material";
import { subBusinessDays } from "date-fns";

import { formatTimeStamp } from "../../../../modules/helper";

const Placeholder = ({ is3DaysFromNow, date }) => {
  const dateStr = date ? formatTimeStamp(date, "MMM dd, yyyy (EEEE)") : "";
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {is3DaysFromNow ? (
        <>
          <Typography variant="h6" gutterBottom>
            {dateStr}
          </Typography>
          <Typography gutterBottom>
            Appointment of schedule for this day will be available on{" "}
            {formatTimeStamp(
              subBusinessDays(new Date(date), 2),
              "MMM dd, yyyy (EEEE)"
            )}
          </Typography>
        </>
      ) : date ? (
        <Typography variant="h6">No schedule for {dateStr}</Typography>
      ) : (
        <Typography variant="h6">Select a date</Typography>
      )}
    </Box>
  );
};

export default Placeholder;
