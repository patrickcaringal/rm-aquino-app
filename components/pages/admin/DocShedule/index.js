import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { Box, Button, Chip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import {
  addDays,
  endOfWeek,
  format,
  getWeek,
  isBefore,
  isSameDay,
  isSunday,
  isWeekend,
  isWithinInterval,
  startOfWeek,
  subDays,
} from "date-fns";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useFormik } from "formik";
import lodash from "lodash";
import { useRouter } from "next/router";

import { FullCalendar, successMessage } from "../../../../components/common";
import { REQUEST_STATUS } from "../../../../components/shared";
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
  days,
  formatTimeStamp,
  getDayOfWeek,
  today,
} from "../../../../modules/helper";
import { checkSlotAppointment, getRangeId, getSlots } from "./utils";

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "dayIsBetween" && prop !== "isFirstDay" && prop !== "isLastDay",
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(isLastDay && {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
}));

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
  const [scheduleDoc, setScheduleDoc] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const slots = getSlots({ schedules, appointments });

  const loading = schedLoading || doctorLoading;

  const formik = useFormik({
    initialValues: {
      date: "",
      startTime: "",
      reasonAppointment: "",
    },
    validateOnChange: false,
    onSubmit: async (values, { setFieldValue }) => {},
  });

  let currD = formik.values.date ? new Date(formik.values.date) : new Date();
  const weekStart = addDays(startOfWeek(currD), 1);
  const weekEnd = subDays(endOfWeek(currD), 1);

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
      const payload = { id: doctorId, weekNo: getWeek(currD) };
      const { data, error } = await getSchedule(payload);
      if (error) return openErrorDialog(error);

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
  }, [doctorId, formik.values.date]);

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

  const remainingBusinessDay = lodash.range(
    isSunday(new Date()) ? 1 : today.dayOfWeek,
    days.businessDays.length + 1,
    1
  );

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

    const hasAppointment = checkSlotAppointment({ start, end, slots });
    if (hasAppointment) {
      openResponseDialog({
        content: "Cannot remove schedule with an Appointment.",
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

    const start = getDayOfWeek();
    const end = getDayOfWeek(4);

    const document = {
      doctorId,
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
              <Chip
                label={`${forApproval} For Approval`}
                size="small"
                color="warning"
              />
            </Box>
          )}
        </Box>
      );
    },
    [slots]
  );

  const businessHours = [
    {
      daysOfWeek: remainingBusinessDay,
      startTime: "08:00",
      endTime: "17:00",
    },
  ];

  const allEvents = [...schedules];

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

  const handleSelectDate = (value) => {
    if (!value || value == "Invalid Date") return;
    formik.setFieldValue("date", formatTimeStamp(value));
    setSchedules([]);
  };

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    // const dateHasAvailableSched = availalbeSchedulesDates.includes(
    //   formatTimeStamp(date)
    // );

    const dayIsBetween = isWithinInterval(date, {
      start: weekStart,
      end: weekEnd,
    });
    const isFirstDay = isSameDay(date, weekStart);
    const isLastDay = isSameDay(date, weekEnd);

    return (
      <CustomPickersDay
        {...pickersDayProps}
        // availSched={dateHasAvailableSched}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 5, pt: 2 }}>
      <Box sx={{ width: 340 }}>
        <Typography variant="body1" fontWeight={500} gutterBottom>
          {doctor?.name}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {doctor?.specialty}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {doctor?.services?.join(", ")}
        </Typography>

        <Box sx={{ width: 300 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              // views={["day"]}
              // orientation="landscape"
              value={formik.values.date}
              // disablePast
              shouldDisableDate={isWeekend}
              onChange={handleSelectDate}
              renderDay={renderWeekPickerDay}
              // renderInput={(params) => {
              //   const s = formatTimeStamp(weekStart, "MMM-dd-yyyy");
              //   const e = formatTimeStamp(weekEnd, "MMM-dd-yyyy");
              //   const v = `${s} to ${e}`;

              //   return (
              //     <Input
              //       {...params}
              //       label="Date range"
              //       inputProps={{ value: v }}
              //       required
              //       name="date"
              //       error={formik.errors.date}
              //     />
              //   );
              // }}
            />
          </LocalizationProvider>
        </Box>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Button variant="contained" size="small" onClick={handleSave}>
          save schedule
        </Button>
        {!loading && (
          <FullCalendar
            initialDate={currD}
            events={allEvents}
            businessHours={businessHours}
            onTimeSelect={handleTimeSelect}
            onEventClick={handleEventClick}
            renderEventContent={renderEventContent}
          />
        )}
      </Box>
    </Box>
  );
};

export default DoctorSchedulePage;
