import React, { useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Link,
  Typography,
} from "@mui/material";
import {
  addBusinessDays,
  addDays,
  addMinutes,
  eachMinuteOfInterval,
  format,
  getMonth,
  getWeek,
  isAfter,
  isBefore,
  isSameDay,
  isWeekend,
  startOfToday,
  subBusinessDays,
} from "date-fns";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addSchedulesReq,
  db,
  getAppointmentsByWeekReq,
  getDoctorAppointmentByMonthReq,
  getScheduleReq,
  updateSchedulesReq,
} from "../../../../modules/firebase";
import {
  days,
  formatTimeStamp,
  getDayOfWeek,
  today,
} from "../../../../modules/helper";
import { FullCalendar, PATHS, successMessage } from "../../../common";
import { REQUEST_STATUS } from "../../../shared";
import { getRangeId, getSlots } from "../DoctorSchedule/utils";
import Header from "./Header";
import Calendar from "./MyCalendar";

const AppointmentsCalendar = () => {
  const router = useRouter();
  const { openResponseDialog, openErrorDialog, closeDialog } =
    useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();
  const doctorId = router.query.id;

  // Requests
  const [getAppointments] = useRequest(
    getDoctorAppointmentByMonthReq,
    setBackdropLoader
  );

  // Local States
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currMonth = getMonth(new Date(selectedDate)) + 1;

  useEffect(() => {
    // Get Appointments
    const fetch = async () => {
      const payload = {
        id: doctorId,
        month: currMonth,
        status: [REQUEST_STATUS.forapproval, REQUEST_STATUS.approved],
      };
      const { data, error } = await getAppointments(payload);
      if (error) return openErrorDialog(error);

      setAppointments(data);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currMonth]);

  const handleEventClick = (info) => {
    if (info.event.title.includes("For Approval")) return;
    router.push({
      pathname: PATHS.ADMIN.MY_APPOINTMENT_APPROVED,
      query: { id: doctorId, date: info.event.startStr },
    });
  };

  const handleCalendarPrev = () => {
    // setBaseDate((prev) => {
    //   const v = subMonths(prev, 1);
    //   const s = startOfMonth(v);
    //   let d = isWeekend(s) ? addBusinessDays(s, 1) : s;
    //   setSelectedDate(d);
    //   return v;
    // });
  };

  const handleCalendarNext = () => {
    // setBaseDate((prev) => {
    //   const v = addMonths(prev, 1);
    //   const s = startOfMonth(v);
    //   let d = isWeekend(s) ? addBusinessDays(s, 1) : s;
    //   setSelectedDate(d);
    //   return v;
    // });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        pt: 2,
        // gap: 10,
        // border: "1px solid red",
      }}
    >
      <Header
        selectedDate={selectedDate}
        handleCalendarPrev={handleCalendarPrev}
        handleCalendarNext={handleCalendarNext}
      />
      <Calendar
        height="calc(100vh - 180px)"
        date={selectedDate}
        events={appointments}
        onEventClick={handleEventClick}
      />
    </Box>
  );
};

export default AppointmentsCalendar;
