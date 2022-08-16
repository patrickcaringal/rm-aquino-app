import React from "react";

import {
  Box,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { addMinutes, isAfter } from "date-fns";

import { formatTimeStamp } from "../../../../modules/helper";

const SlotComponent = ({ slot, unavailableTimeslots, ownedTimeslots }) => {
  const start = formatTimeStamp(slot, "hh:mm a");
  const end = formatTimeStamp(addMinutes(slot, 30), "hh:mm a");
  const content = `${start} - ${end}`;
  const isPast = isAfter(new Date(), slot);
  const unavailable = unavailableTimeslots.includes(start);
  const owned = ownedTimeslots.includes(start);
  const disabled = isPast || unavailable;

  return (
    <Box>
      <FormControlLabel
        value={start}
        control={<Radio />}
        label={content}
        disabled={disabled}
      />
      {(owned || unavailable) && (
        <Chip
          label={`${owned ? "Your Slot" : "Slot Taken"} `}
          size="small"
          color={`${owned ? "primary" : "error"}`}
        />
      )}
    </Box>
  );
};

const ScheduleAppointmentPage = ({
  selectedDate,
  AMTimeslot,
  PMTimeslot,
  unavailableTimeslots = [],
  ownedTimeslots = [],
  selectedTimeslot,
  onSelectTimeslot,
}) => {
  const hasAMSlot = !!AMTimeslot.length;
  const hasPMSlot = !!PMTimeslot.length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {selectedDate && formatTimeStamp(selectedDate, "MMM dd, yyyy (EEEE)")}{" "}
        Schedules
      </Typography>
      <RadioGroup
        value={selectedTimeslot}
        onChange={onSelectTimeslot}
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
        }}
      >
        {hasAMSlot && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            {AMTimeslot.map((slot) => {
              return (
                <SlotComponent
                  key={formatTimeStamp(slot, "hh:mm a")}
                  slot={slot}
                  unavailableTimeslots={unavailableTimeslots}
                  ownedTimeslots={ownedTimeslots}
                />
              );
            })}
          </Box>
        )}
        {hasPMSlot && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            {PMTimeslot.map((slot) => {
              return (
                <SlotComponent
                  key={formatTimeStamp(slot, "hh:mm a")}
                  slot={slot}
                  unavailableTimeslots={unavailableTimeslots}
                  ownedTimeslots={ownedTimeslots}
                />
              );
            })}
          </Box>
        )}
      </RadioGroup>
    </Box>
  );
};

export default ScheduleAppointmentPage;
