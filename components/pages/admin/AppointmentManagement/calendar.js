import React, { useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Link,
  Typography,
} from "@mui/material";
import { addWeeks, format, getWeek, isBefore } from "date-fns";
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

const DoctorSchedulePage = () => {
  const router = useRouter();
  const { openResponseDialog, openErrorDialog, closeDialog } =
    useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests

  const [getAppointments] = useRequest(
    getAppointmentsByWeekReq,
    setBackdropLoader
  );
  const [getSchedule, loading] = useRequest(getScheduleReq, setBackdropLoader);
  const [addSchedules] = useRequest(addSchedulesReq, setBackdropLoader);
  const [updateSchedules] = useRequest(updateSchedulesReq, setBackdropLoader);

  // Local States
  const [weeekCounter, setWeeekCounter] = useState(0);
  const [scheduleDoc, setScheduleDoc] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const baseDay = addWeeks(new Date(), weeekCounter);
  const weekNo = today.weekNo + weeekCounter;
  const slots = getSlots({ schedules, appointments });

  useEffect(() => {
    const fetchSchedules = async () => {
      // Get Schedule
      const payload = { weekNo };
      const { data, error: getScheduleError } = await getSchedule(payload);
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

    const fetchAppointments = async () => {
      // Get Schedule
      const payload = { weekNo };
      const { data, error: getError } = await getAppointments(payload);
      if (getError) return openErrorDialog(getError);

      setAppointments(data);
    };

    fetchSchedules();
    // fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekNo]);

  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      where("weekNo", "==", weekNo),
      where("status", "in", [
        REQUEST_STATUS.approved,
        REQUEST_STATUS.forapproval,
      ])
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length > 0) {
        const appointmentList = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        setAppointments(appointmentList);
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekNo]);

  const renderEventContent = useCallback(
    (arg) => {
      const rangeId = getRangeId({
        start: arg.event.start,
        end: arg.event.end,
      });
      const forApproval = slots.forApproval?.[rangeId]?.length;
      const approved = slots.approved?.[rangeId]?.length;

      return (
        <Box sx={{ px: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <Box>{arg.timeText}</Box>
          {!!approved && (
            <Box>
              <Chip
                label={`${approved} Approved`}
                size="small"
                color="primary"
              />
            </Box>
          )}
          {!!forApproval && (
            <Box>
              <a
                target="_blank"
                href={`${
                  PATHS.ADMIN.APPOINTMENT_APPROVAL
                }?date=${formatTimeStamp(arg.event.start)}`}
                rel="noreferrer"
              >
                <Chip
                  label={`${forApproval} For Approval`}
                  size="small"
                  color="warning"
                  onClick={() => {}}
                />
              </a>
            </Box>
          )}
        </Box>
      );
    },
    [slots]
  );

  const handleCalendarPrev = () => {
    setWeeekCounter((prev) => prev - 1);
  };

  const handleCalendarNext = () => {
    setWeeekCounter((prev) => prev + 1);
  };

  const allEvents = [...schedules];

  return (
    <Box sx={{ pt: 2 }}>
      <Box>
        <ButtonGroup size="small">
          <Button onClick={handleCalendarPrev}>Prev</Button>
          <Button onClick={handleCalendarNext}>Next</Button>
        </ButtonGroup>
      </Box>

      <Box>
        {!loading && (
          <FullCalendar
            initialDate={baseDay}
            events={allEvents}
            renderEventContent={renderEventContent}
          />
        )}
      </Box>
    </Box>
  );
};

export default DoctorSchedulePage;
