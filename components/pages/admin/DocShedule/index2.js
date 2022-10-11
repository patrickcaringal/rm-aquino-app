import React, { useEffect, useLayoutEffect, useState } from "react";

import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import {
  addBusinessDays,
  addMonths,
  format,
  getWeek,
  getYear,
  isBefore,
  isWeekend,
  startOfMonth,
  subMonths,
} from "date-fns";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useFormik } from "formik";
import lodash, { result } from "lodash";
import { useRouter } from "next/router";

import { successMessage } from "../../../../components/common";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addSchedulesReq,
  db,
  getDoctorReq,
  getScheduleByDoctorReq,
  updateSchedulesReq,
} from "../../../../modules/firebase";
import {
  DATE_FORMAT,
  days,
  formatTimeStamp,
  getDayOfWeek,
  getMonthNo,
  today,
} from "../../../../modules/helper";
import Calendar from "./Calendar";
import Header from "./Header";
import TimeGrid from "./TimeGrid";
import { checkSlotAppointment, getRangeId, getSlots } from "./utils";

const DoctorSchedulePage = () => {
  const router = useRouter();
  const { openResponseDialog, openErrorDialog, closeDialog } =
    useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  const doctorId = router.query?.id;

  // Requests
  const [getSchedule, schedLoading] = useRequest(
    getScheduleByDoctorReq,
    setBackdropLoader
  );
  const [getDoctor, doctorLoading] = useRequest(
    getDoctorReq,
    setBackdropLoader
  );
  const [addSchedules] = useRequest(addSchedulesReq, setBackdropLoader);
  const [updateSchedules] = useRequest(updateSchedulesReq, setBackdropLoader);

  // Local States
  const [doctor, setDoctor] = useState({});
  const [scheduleDoc, setScheduleDoc] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [baseDate, setBaseDate] = useState(new Date());
  const [timeGridData, setTimeGridData] = useState([]);
  const [timeGridLoading, setTimeGridLoading] = useState(false);

  // const slots = getSlots({ schedules, appointments });

  const calendarLoading = schedLoading || doctorLoading;

  useLayoutEffect(() => {
    const fetch = async () => {
      // Get Doctor
      const payload = { id: doctorId };
      const { data, error } = await getDoctor(payload);
      if (error) return openErrorDialog(error);

      setDoctor(data);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  useLayoutEffect(() => {
    const fetch = async () => {
      // Get Schedule
      const payload = { id: doctorId, monthNo: getMonthNo(baseDate) };
      const { data, error } = await getSchedule(payload);
      if (error) return openErrorDialog(error);

      // console.log({ data });
      // if (data?.schedules) {
      //   setScheduleDoc(data);
      //   setSchedules(
      //     data.schedules.reduce((acc, i) => {
      //       return [...acc, ...i.schedules];
      //     }, [])
      //   );
      // }
      setScheduleDoc(data);
      setSchedules(
        data?.schedules?.reduce((acc, i) => {
          return [...acc, ...i.schedules];
        }, []) || []
      );
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, baseDate]);

  useEffect(() => {
    const e = filterEvent(formatTimeStamp(selectedDate), schedules);
    setTimeGridData(e);
  }, [selectedDate, schedules]);

  // useEffect(() => {
  //   const q = query(
  //     collection(db, "appointments"),
  //     where("weekNo", "==", today.weekNo),
  //     where("status", "in", [
  //       REQUEST_STATUS.approved,
  //       REQUEST_STATUS.forapproval,
  //     ])
  //   );

  //   const unsub = onSnapshot(q, (querySnapshot) => {
  //     if (querySnapshot.docs.length > 0) {
  //       const appointmentList = querySnapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //       }));

  //       setAppointments(appointmentList);
  //     }
  //   });

  //   return () => unsub();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleAddEvent = (event) => {
    setTimeGridData((prev) =>
      [...prev, event].sort((a, b) => new Date(a.start) - new Date(b.start))
    );
  };

  const handleRemoveEvent = (event) => {
    const { start, end } = event;
    // setSchedules((prev) =>
    //   prev.filter((i) => `${i.start}${i.end}` !== `${start}${end}`)
    // );
    setTimeGridData((prev) =>
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

    // const hasAppointment = checkSlotAppointment({ start, end, slots });
    // if (hasAppointment) {
    //   openResponseDialog({
    //     content: "Cannot remove schedule with an Appointment.",
    //     type: "WARNING",
    //     autoClose: true,
    //   });
    //   return;
    // }

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
    const otherSched = clearEvent(formatTimeStamp(selectedDate), schedules);
    const updatedSched = [...otherSched, ...timeGridData];

    const group = updatedSched.reduce((acc, i) => {
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

    // const start = getDayOfWeek(0, selectedDate);
    // const end = getDayOfWeek(4, selectedDate);

    const document = {
      doctorId,
      // start: format(start, "yyyy-MM-dd"),
      // end: format(end, "yyyy-MM-dd"),
      // weekNo: getWeek(new Date(start)),
      monthNo: getMonthNo(new Date(selectedDate)),
      year: getYear(new Date(selectedDate)),
      schedules: schedArray,
    };

    console.log(scheduleDoc.id, document);
    // return;

    if (scheduleDoc.id) {
      const payload = { document: { ...document, id: scheduleDoc.id } };
      const { error: saveError } = await updateSchedules(payload);
      if (saveError) return openErrorDialog(saveError);
    } else {
      // Add
      const payload = { document };
      const { data, error: saveError } = await addSchedules(payload);
      if (saveError) return openErrorDialog(saveError);
      setScheduleDoc((prev) => ({ ...prev, id: data.id }));
    }

    // Success
    setSchedules(updatedSched);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Schedule",
        verb: "saved",
      }),
      type: "SUCCESS",
    });
  };

  const loadTimeGrid = () => {
    setTimeGridLoading(true);
    setBackdropLoader(true);

    setTimeout(() => {
      setTimeGridLoading(false);
      setBackdropLoader(false);
    }, 1000);
  };

  const handleDateClick = (info) => {
    // if same do nothing
    if (formatTimeStamp(selectedDate) === info.dateStr) return;

    setSelectedDate(new Date(info.dateStr));
    loadTimeGrid();
  };

  const handleCalendarPrev = () => {
    setBaseDate((prev) => {
      const v = subMonths(prev, 1);
      const s = startOfMonth(v);
      let d = isWeekend(s) ? addBusinessDays(s, 1) : s;
      setSelectedDate(d);
      return v;
    });
  };

  const handleCalendarNext = () => {
    setBaseDate((prev) => {
      const v = addMonths(prev, 1);
      const s = startOfMonth(v);
      let d = isWeekend(s) ? addBusinessDays(s, 1) : s;
      setSelectedDate(d);
      return v;
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", pt: 3, gap: 10 }}>
      <Box sx={{ flex: 1 }}>
        <Header
          doctor={doctor}
          selectedDate={selectedDate}
          handleCalendarPrev={handleCalendarPrev}
          handleCalendarNext={handleCalendarNext}
        />
        {!calendarLoading && (
          <Calendar
            date={selectedDate}
            events={schedules}
            onDateClick={handleDateClick}
          />
        )}
      </Box>
      <Box sx={{ width: 400 }} id="doc-sched-timegrid">
        <TimeGrid
          loading={calendarLoading || timeGridLoading}
          date={selectedDate}
          events={timeGridData}
          onTimeSelect={handleTimeSelect}
          onEventClick={handleEventClick}
          onSave={handleSave}
        />
      </Box>
    </Box>
  );
};

export default DoctorSchedulePage;

const filterEvent = (date, events) => {
  const res = events.filter((i) => {
    const b = formatTimeStamp(i.start);
    return date === b;
  });

  return res;
};

const clearEvent = (date, events) => {
  const res = events.filter((i) => {
    const b = formatTimeStamp(i.start);
    return date !== b;
  });

  return res;
};
