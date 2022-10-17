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
import Calendar from "./CalendarComp";

const DoctorSchedulePage = () => {
  const router = useRouter();
  const { openResponseDialog, openErrorDialog, closeDialog } =
    useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests

  // Local States
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currMonth = getMonth(new Date(selectedDate)) + 1;

  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      where("month", "==", currMonth),
      where("status", "==", REQUEST_STATUS.forapproval),
      where("rejected", "==", false)
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length > 0) {
        const data = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
        const a = data.map((i) => ({
          ...i,
        }));
        setAppointments(a);
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currMonth]);

  const handleEventClick = (info) => {
    router.push({
      pathname: PATHS.ADMIN.APPOINTMENT_APPROVAL,
      query: { date: info.event.startStr },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        pt: 3,
        // gap: 10,
        // border: "1px solid red",
      }}
    >
      <Calendar
        date={selectedDate}
        events={appointments}
        onEventClick={handleEventClick}
      />
    </Box>
  );
};

export default DoctorSchedulePage;
