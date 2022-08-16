import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import {
  addBusinessDays,
  addDays,
  addMinutes,
  eachMinuteOfInterval,
  format,
  getWeek,
  isAfter,
  isBefore,
  isSameDay,
  isWeekend,
  startOfToday,
} from "date-fns";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import lodash from "lodash";

import { successMessage } from "../../../../components/common";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { db } from "../../../../modules/firebase";
import { formatTimeStamp, today } from "../../../../modules/helper";

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "availSched" && prop !== "isSelected",
})(({ theme, availSched, notAvailSched, selected }) => ({
  ...(availSched && {
    backgroundColor: theme.palette.success.light,
    // color: theme.palette.common.white,
  }),
  ...(notAvailSched && {
    backgroundColor: theme.palette.error.light,
    // color: theme.palette.common.white,
  }),
  ...(selected && {
    backgroundColor: `${theme.palette.info.main} !important`,
    // color: theme.palette.common.white,
  }),
}));

const ScheduleAppointmentPage = ({
  selectedDate,
  AMTimeslot,
  PMTimeslot,
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
              const start = formatTimeStamp(slot, "hh:mm a");
              const end = formatTimeStamp(addMinutes(slot, 30), "hh:mm a");
              const content = `${start} - ${end}`;
              return (
                <FormControlLabel
                  key={content}
                  value={start}
                  control={<Radio />}
                  label={content}
                  disabled={isAfter(new Date(), slot)}
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
              const start = formatTimeStamp(slot, "hh:mm a");
              const end = formatTimeStamp(addMinutes(slot, 30), "hh:mm a");
              const content = `${start} - ${end}`;
              return (
                <FormControlLabel
                  key={content}
                  value={start}
                  control={<Radio />}
                  label={content}
                  disabled={isAfter(new Date(), slot)}
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
