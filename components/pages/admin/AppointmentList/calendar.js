import React, { useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Link,
  Typography,
} from "@mui/material";
import { addMonths, getMonth, subMonths } from "date-fns";
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
import Header from "./Header";

const AppointmentsCalendar = () => {
  const router = useRouter();
  const { openResponseDialog, openErrorDialog, closeDialog } =
    useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests

  // Local States
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [baseDate, setBaseDate] = useState(new Date());
  const [UILoading, setUILoading] = useState(false);

  const currMonth = getMonth(new Date(baseDate)) + 1;

  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      where("month", "==", currMonth),
      where("status", "in", [
        REQUEST_STATUS.forapproval,
        REQUEST_STATUS.approved,
      ])
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
    if (info.event.title.includes("For Approval")) {
      router.push({
        pathname: PATHS.ADMIN.APPOINTMENT_APPROVAL,
        query: { date: info.event.startStr },
      });
      return;
    }

    router.push({
      pathname: PATHS.ADMIN.APPOINTMENT_APPROVED,
      query: { date: info.event.startStr },
    });
  };

  const loadTimeGrid = () => {
    setUILoading(true);
    setBackdropLoader(true);

    setTimeout(() => {
      setUILoading(false);
      setBackdropLoader(false);
    }, 1000);
  };

  const handleCalendarPrev = () => {
    loadTimeGrid();
    setBaseDate((prev) => {
      return subMonths(prev, 1);
    });
  };

  const handleCalendarNext = () => {
    loadTimeGrid();
    setBaseDate((prev) => {
      return addMonths(prev, 1);
    });
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
        selectedDate={baseDate}
        handleCalendarPrev={handleCalendarPrev}
        handleCalendarNext={handleCalendarNext}
      />
      {!UILoading && (
        <Calendar
          height="calc(100vh - 180px)"
          date={baseDate}
          events={appointments}
          onEventClick={handleEventClick}
        />
      )}
    </Box>
  );
};

export default AppointmentsCalendar;
