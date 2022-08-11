import React, { useEffect, useState } from "react";

import { Box, Button, Typography } from "@mui/material";
import { addWeeks, format, getWeek, isBefore } from "date-fns";
import lodash from "lodash";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addSchedulesReq,
  getScheduleReq,
  updateSchedulesReq,
} from "../../../../modules/firebase";
import { days, getDayOfWeek, today } from "../../../../modules/helper";
import { FullCalendar, successMessage } from "../../../common";

const DoctorSchedulePage = () => {
  const { openResponseDialog, openErrorDialog, closeDialog } =
    useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();
  const baseDay = addWeeks(new Date(), 1);

  // Requests
  const [getSchedule] = useRequest(getScheduleReq, setBackdropLoader);
  const [addSchedules] = useRequest(addSchedulesReq, setBackdropLoader);
  const [updateSchedules] = useRequest(updateSchedulesReq, setBackdropLoader);

  // Local States
  const [scheduleDoc, setScheduleDoc] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      // Get Schedule
      const { data, error: getScheduleError } = await getSchedule({
        weekNo: today.weekNo + 1,
      });
      if (getScheduleError) return openErrorDialog(getScheduleError);

      if (data?.schedules) {
        setScheduleDoc(data);
        setSchedules(
          data.schedules.reduce((acc, i) => {
            return [...acc, ...i.schedules];
          }, [])
        );
      }
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remainingBusinessDay = lodash.range(1, days.businessDays.length + 1, 1);

  const handleAddEvent = (event) => {
    setSchedules((prev) =>
      [...prev, event].sort((a, b) => new Date(a.start) - new Date(b.start))
    );
  };

  const handleRemoveEvent = (event) => {
    const { start, end } = event;
    setSchedules((prev) =>
      prev.filter((i) => `${i.start}${i.end}` !== `${start}${end}`)
    );
  };

  const handleTimeSelect = (arg) => {
    const { start, end } = arg;

    const isPastTime = isBefore(start, new Date());
    if (isPastTime) {
      openResponseDialog({
        content: "Cannot add schedule past current time.",
        type: "WARNING",
        autoClose: true,
      });
      return;
    }

    const content = (
      <>
        <Typography variant="body1" color="text.secondary">
          {format(start, "MMM dd, yyyy")} (
          {`${format(start, "HH:mm")} - ${format(end, "HH:mm")}`})
        </Typography>
      </>
    );

    openResponseDialog({
      title: "Add Schedule",
      content,
      type: "CONFIRM",
      actions: (
        <Button
          variant="contained"
          onClick={() => {
            handleAddEvent({
              start: format(start, "yyyy-MM-dd HH:mm"),
              end: format(end, "yyyy-MM-dd HH:mm"),
            });
            closeDialog();
          }}
          size="small"
        >
          Add
        </Button>
      ),
    });
  };

  const handleEventClick = (info) => {
    const { start, end } = info.event;

    const isPastTime = isBefore(start, new Date());
    if (isPastTime) {
      openResponseDialog({
        content: "Cannot remove schedule past current time.",
        type: "WARNING",
        autoClose: true,
      });
      return;
    }

    const content = (
      <>
        <Typography variant="body1" color="text.secondary">
          {format(start, "MMM dd, yyyy")} (
          {`${format(start, "HH:mm")} - ${format(end, "HH:mm")}`})
        </Typography>
      </>
    );

    openResponseDialog({
      title: "Remove Schedule",
      content,
      type: "CONFIRM",
      actions: (
        <Button
          color="error"
          onClick={() => {
            handleRemoveEvent({
              start: format(start, "yyyy-MM-dd HH:mm"),
              end: format(end, "yyyy-MM-dd HH:mm"),
            });
            closeDialog();
          }}
          size="small"
        >
          Delete
        </Button>
      ),
    });
  };

  const handleSave = async () => {
    const group = schedules.reduce((acc, i) => {
      const { start, end } = i;
      const key = format(new Date(start), "yyyy-MM-dd");
      const keyExist = !!acc[key];

      if (keyExist) {
        return {
          ...acc,
          [key]: [...acc[key], i],
        };
      }

      return {
        ...acc,
        [key]: [i],
      };
    }, {});

    const schedArray = Object.entries(group).map(([k, v]) => ({
      date: k,
      schedules: v,
    }));

    const start = getDayOfWeek(0, baseDay);
    const end = getDayOfWeek(4, baseDay);

    const document = {
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
      weekNo: getWeek(new Date(start)),
      schedules: schedArray,
    };

    if (scheduleDoc.id) {
      const payload = { document: { ...document, id: scheduleDoc.id } };
      const { error: saveError } = await updateSchedules(payload);
      if (saveError) return openErrorDialog(saveError);
    } else {
      // Add
      const payload = { document };
      const { error: saveError } = await addSchedules(payload);
      if (saveError) return openErrorDialog(saveError);
    }

    // Success
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Schedule",
        verb: "saved",
      }),
      type: "SUCCESS",
    });
  };

  const businessHours = [
    {
      daysOfWeek: remainingBusinessDay,
      startTime: "08:00",
      endTime: "17:00",
    },
  ];

  const allEvents = [...schedules];

  return (
    <Box sx={{ pt: 2 }}>
      <Box>
        <Button variant="contained" size="small" onClick={handleSave}>
          save schedules
        </Button>
      </Box>

      <Box>
        <FullCalendar
          initialDate={baseDay}
          events={allEvents}
          businessHours={businessHours}
          onTimeSelect={handleTimeSelect}
          onEventClick={handleEventClick}
        />
      </Box>
    </Box>
  );
};

export default DoctorSchedulePage;
