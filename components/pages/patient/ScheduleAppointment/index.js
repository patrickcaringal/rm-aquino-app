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
  addMinutes,
  eachMinuteOfInterval,
  format,
  getWeek,
  isBefore,
  isSameDay,
  isWeekend,
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

const ScheduleAppointmentPage = () => {
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests

  // Local States
  const [schedules, setSchedules] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);

  useEffect(() => {
    const weeks = getNext2DaysWeekNo();
    const q = query(collection(db, "schedules"), where("weekNo", "in", weeks));

    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length > 0) {
        const data = querySnapshot.docs.reduce((acc, doc) => {
          const weekSched = doc.data();

          const availSched = weekSched.schedules.reduce((acc2, i) => {
            return { ...acc2, [i.date]: i.schedules };
          }, {});

          return {
            ...acc,
            ...availSched,
          };
        }, {});

        setSchedules(data);
      } else {
        // console.log("no queue");
        // setQueueToday({});
      }
    });

    return () => unsub();
  }, []);

  const getNext2DaysWeekNo = () => {
    if (["1", "2", "3"].includes(today.dayOfWeek)) {
      return [today.weekNo];
    }

    return [today.weekNo, today.weekNo + 1];
  };

  const availalbeSchedulesDates = lodash.keys(schedules);

  // console.log({ availalbeSchedulesDates });

  // const notAvailalbeSchedulesDates = [
  //   formatTimeStamp(new Date(new Date().valueOf() + 1000 * 3600 * 48)),
  // ];

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    const dateHasAvailableSched = availalbeSchedulesDates.includes(
      formatTimeStamp(date)
    );
    // const dateNotAvailableSched = notAvailalbeSchedulesDates.includes(
    //   formatTimeStamp(date)
    // );

    // return <PickersDay {...pickersDayProps} />;
    return (
      <CustomPickersDay
        {...pickersDayProps}
        availSched={dateHasAvailableSched}
        // notAvailSched={dateNotAvailableSched}
        // isSelected={isSelected}
      />
    );
  };

  const getTimeSlots = () => {
    return (schedules[selectedDate] || []).reduce((acc, i, index) => {
      const timeslots = eachMinuteOfInterval(
        {
          start: new Date(i.start),
          end: new Date(i.end),
        },
        { step: 30 }
      );
      timeslots.pop(); // remove excess 30mins

      const AMTimeslot = timeslots.filter(
        (i) => formatTimeStamp(i, "a") == "AM"
      );
      const PMTimeslot = timeslots.filter(
        (i) => formatTimeStamp(i, "a") == "PM"
      );

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

  const { AM: AMTimeslot = [], PM: PMTimeslot = [] } = getTimeSlots();

  const handleSelectDate = (value) => {
    setSelectedDate(formatTimeStamp(value));
    setSelectedTimeslot(null);
  };
  const handleSelectTimeslot = (event) => {
    setSelectedTimeslot(event.target.value);
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
        }}
      >
        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              views={["day"]}
              orientation="landscape"
              // openTo="day"
              disablePast
              value={null}
              shouldDisableDate={isWeekend}
              onChange={handleSelectDate}
              renderDay={renderWeekPickerDay}
            />
          </LocalizationProvider>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Typography gutterBottom>
            {selectedDate &&
              formatTimeStamp(selectedDate, "MMM dd, yyyy (EEEE)")}{" "}
            Schedules
          </Typography>
          <RadioGroup
            value={selectedTimeslot}
            onChange={handleSelectTimeslot}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
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
                    value={content}
                    control={<Radio />}
                    label={content}
                  />
                );
              })}
            </Box>
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
                    value={content}
                    control={<Radio />}
                    label={content}
                  />
                );
              })}
            </Box>
          </RadioGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default ScheduleAppointmentPage;
