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
import { REQUEST_STATUS } from "../../../shared";

const SlotComponent = ({ time, disabledSlots, disabled: d }) => {
  const start = formatTimeStamp(time, "hh:mm a");
  const end = formatTimeStamp(addMinutes(time, 30), "hh:mm a");
  const content = `${start} - ${end}`;
  const isPast = isAfter(new Date(), time);
  const taken = disabledSlots.find((i) => i.startTime === start);
  const disabled = d || !!taken || isPast;

  const label = {
    [REQUEST_STATUS.forapproval]: "For Approval",
    [REQUEST_STATUS.approved]: "Approved",
    [REQUEST_STATUS.done]: "Done",
    others: "Taken",
  };

  const color = {
    [REQUEST_STATUS.forapproval]: "primary",
    [REQUEST_STATUS.approved]: "primary",
    [REQUEST_STATUS.done]: "primary",
    others: "error",
  };

  return (
    <Box>
      <FormControlLabel
        disabled={disabled}
        value={start}
        control={<Radio size="small" disableRipple />}
        label={<Typography variant="body2">{content}</Typography>}
      />
      {!!taken && (
        <Chip
          label={label[taken.type]}
          size="small"
          color={color[taken.type]}
          variant={
            taken.type === REQUEST_STATUS.forapproval ? "outlined" : "filled"
          }
        />
      )}
    </Box>
  );
};

const Timepicker = ({
  data = [],
  appointments = [],
  date,
  doctor,
  selected,
  onTimeselect,
}) => {
  const dateStr = formatTimeStamp(date);
  const { AM: AMTimeslot = [], PM: PMTimeslot = [] } = getTimeSlots(data);
  const hasAMSlot = !!AMTimeslot.length;
  const hasPMSlot = !!PMTimeslot.length;

  const disabledSlots = appointments.filter((i) => i.date === dateStr);

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
          disabled
        >
          {hasAMSlot && (
            <Box>
              <Typography variant="body2" fontWeight={500}>
                AM Slots
              </Typography>
              {AMTimeslot.map((slot, idx) => (
                <SlotComponent
                  key={idx}
                  disabled={!!disabledSlots.length}
                  time={slot}
                  disabledSlots={disabledSlots}
                />
              ))}
            </Box>
          )}

          {hasPMSlot && (
            <Box>
              <Typography variant="body2" fontWeight={500}>
                PM Slots
              </Typography>
              {PMTimeslot.map((slot, idx) => (
                <SlotComponent
                  key={idx}
                  disabled={!!disabledSlots.length}
                  time={slot}
                  disabledSlots={disabledSlots}
                />
              ))}
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
