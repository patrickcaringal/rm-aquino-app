import React from "react";

import {
  Box,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { addMinutes, eachMinuteOfInterval, isAfter } from "date-fns";

import { formatTimeStamp } from "../../../../modules/helper";

const Timepicker = ({ data = [], date, doctor, selected, onTimeselect }) => {
  const { AM: AMTimeslot = [], PM: PMTimeslot = [] } = getTimeSlots(data);
  const hasAMSlot = !!AMTimeslot.length;
  const hasPMSlot = !!PMTimeslot.length;

  return (
    <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
      <Typography variant="body1" fontWeight="600">
        Dr. {doctor}
      </Typography>
      <Typography variant="body2" fontWeight="500" gutterBottom>
        {date && formatTimeStamp(date, "MMM dd, yyyy (EEE)")}
      </Typography>

      <Box
        sx={{
          maxHeight: "calc(100vh - 276px)",
          overflow: "overlay",
        }}
      >
        <RadioGroup
          value={selected}
          onChange={onTimeselect}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
            ml: "1px",
          }}
        >
          {hasAMSlot && (
            <Box>
              <Typography variant="body2" fontWeight={500}>
                AM Slots
              </Typography>
              {AMTimeslot.map((slot, idx) => {
                const start = formatTimeStamp(slot, "hh:mm a");
                const end = formatTimeStamp(addMinutes(slot, 30), "hh:mm a");
                const content = `${start} - ${end}`;

                return (
                  <Box key={idx}>
                    <FormControlLabel
                      value={start}
                      control={<Radio size="small" disableRipple />}
                      label={<Typography variant="body2">{content}</Typography>}
                    />
                    {/* {renderChip()} */}
                  </Box>
                );
              })}
            </Box>
          )}

          {hasPMSlot && (
            <Box>
              <Typography variant="body2" fontWeight={500}>
                PM Slots
              </Typography>
              {PMTimeslot.map((slot, idx) => {
                const start = formatTimeStamp(slot, "hh:mm a");
                const end = formatTimeStamp(addMinutes(slot, 30), "hh:mm a");
                const content = `${start} - ${end}`;

                return (
                  <Box key={idx}>
                    <FormControlLabel
                      value={start}
                      control={<Radio size="small" disableRipple />}
                      label={<Typography variant="body2">{content}</Typography>}
                    />
                    {/* {renderChip()} */}
                  </Box>
                );
              })}
            </Box>
          )}
        </RadioGroup>
      </Box>
    </Box>
  );
};

export default Timepicker;

const getTimeSlots = (data = []) => {
  return data.reduce((acc, i, index) => {
    const timeslots = eachMinuteOfInterval(
      {
        start: new Date(i.start),
        end: new Date(i.end),
      },
      { step: 30 }
    );
    timeslots.pop(); // remove excess 30mins

    const AMTimeslot = timeslots.filter((i) => formatTimeStamp(i, "a") == "AM");
    const PMTimeslot = timeslots.filter((i) => formatTimeStamp(i, "a") == "PM");

    return {
      ...acc,
      ...(AMTimeslot.length && {
        AM: AMTimeslot,
      }),
      ...(PMTimeslot.length && {
        PM: PMTimeslot,
      }),
    };
  }, {});
};
