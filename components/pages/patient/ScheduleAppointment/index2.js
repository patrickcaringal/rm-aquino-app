import React, { useEffect, useLayoutEffect, useState } from "react";

import {
  Box,
  Button,
  FormControlLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Tooltip,
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
  addMonths,
  eachMinuteOfInterval,
  format,
  getMonth,
  getWeek,
  isAfter,
  isBefore,
  isSameDay,
  isWeekend,
  startOfMonth,
  startOfToday,
  subBusinessDays,
  subDays,
  subMonths,
} from "date-fns";
import faker from "faker";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useFormik } from "formik";
import lodash from "lodash";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { isMockDataEnabled } from "../../../../modules/env";
import {
  addAppointmentReq,
  db,
  getDoctorsByServiceReq,
  getDoctorsScheduleReq,
  getServicesReq,
} from "../../../../modules/firebase";
import { formatTimeStamp, getMonthNo, today } from "../../../../modules/helper";
import { ACTION_ICONS, Select, successMessage } from "../../../common";
import { Input } from "../../../common/Form";
import { REQUEST_STATUS } from "../../../shared";
import Calendar from "./Calendar";
import Header from "./Header";
import PlaceholderComponent from "./Placeholder";
import TimePicker from "./TimePicker";
import TimeslotComponent from "./Timeslot";

const ScheduleAppointmentPage = () => {
  const { user } = useAuth();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getServices] = useRequest(getServicesReq, setBackdropLoader);
  const [getDoctors, doctorLoading] = useRequest(
    getDoctorsByServiceReq,
    setBackdropLoader
  );
  const [getSchedule, schedLoading] = useRequest(
    getDoctorsScheduleReq,
    setBackdropLoader
  );
  const [addAppointment] = useRequest(addAppointmentReq, setBackdropLoader);

  // Local States
  const [services, setServices] = useState([]);
  // const [servicesMap, setServicesMap] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeslots, setTimeslots] = useState([]);
  const [baseDate, setBaseDate] = useState(new Date());

  const servicesMap = services.reduce(idNameMap, {});
  const doctorsMap = doctors.reduce(idNameMap, {});

  const formik = useFormik({
    initialValues: {
      doctorId: "",
      serviceId: "",
      date: "",
      startTime: "",
    },
    validateOnChange: false,
    onSubmit: async (values, { setFieldValue }) => {
      const { date, startTime } = values;
      const endTimeEstimate = formatTimeStamp(
        addMinutes(new Date(`${date} ${startTime}`), 30),
        "hh:mm a"
      );

      const document = {
        ...values,
        endTimeEstimate,
        weekNo: getWeek(new Date(date)),
        month: getMonth(new Date(date)) + 1,
        doctor: `DR. ${doctorsMap[values.doctorId]}`,
        service: servicesMap[values.serviceId],
        // user
        patientId: user.id,
        patientEmail: user.email,
        patientName: user.name,
        status: REQUEST_STATUS.forapproval,
        approved: false,
        rejected: false,
      };

      // Add Appointment
      const payload = { document };
      const { data, error: addError } = await addAppointment(payload);
      if (addError) return openErrorDialog(addError);

      // Successful
      openResponseDialog({
        autoClose: true,
        content: successMessage({
          noun: "Appointment",
          verb: "submitted",
        }),
        type: "SUCCESS",
        closeCb() {
          setFieldValue("startTime", "");
          setFieldValue("reasonAppointment", "");
        },
      });
    },
  });

  const calendarLoading = schedLoading || doctorLoading;
  const currMonth = getMonth(new Date(baseDate)) + 1;

  const prevDisabled = getMonth(new Date()) + 1 >= currMonth;
  const nextDisabled = getMonth(new Date()) + 2 <= currMonth;

  const displayCalendar = formik.values.serviceId && !calendarLoading;
  const displayTimepicker = displayCalendar && formik.values.doctorId;
  const disabledSave = !(displayTimepicker && formik.values.startTime);

  // const x = getMyAppointments(user.id, appointments);

  useLayoutEffect(() => {
    const fetchServices = async () => {
      // Get Services
      const { data, map, error } = await getServices();
      if (error) return openErrorDialog(error);

      setServices(data);
    };

    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!!formik.values.serviceId) {
      const fetch = async () => {
        // Get Doctors
        const payload = { services: [formik.values.serviceId] };
        const { data, error: getError } = await getDoctors(payload);
        if (getError) return openErrorDialog(getError);

        setDoctors(data);
        if (data.length > 0) fetchSchedule(data);
      };

      const fetchSchedule = async (d) => {
        // Get Sched
        const payload = { ids: d.map((i) => i.id), monthNo: currMonth };
        const { data, error: getError } = await getSchedule(payload);
        if (getError) return openErrorDialog(getError);

        // Combine schedules
        let sched = data.reduce((a, i) => {
          // combine per time slot
          const s = i.schedules.reduce((b, j) => {
            const c =
              j.schedules.length > 0
                ? j.schedules.map((k) => ({ ...k, id: i.doctorId })) // insert doctor name on sched
                : null;

            return c ? [...b, ...c] : b;
          }, []);

          // combine per doctor
          return [...a, ...s];
        }, []);

        sched = sched.filter((i) =>
          isAfter(new Date(i.start), subDays(new Date(), 1))
        );

        setSchedules(sched);
      };

      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.serviceId, currMonth]);

  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      where("month", "==", currMonth),
      where("status", "in", [
        REQUEST_STATUS.forapproval,
        REQUEST_STATUS.approved,
        REQUEST_STATUS.done,
      ])
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length > 0) {
        const data = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
        const a = data.map((i) => ({
          ...i,
          type: i.patientId === user.id ? i.status : "others",
        }));
        setAppointments(a);
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currMonth, user.id]);

  const handleDoctorClick = (info) => {
    const date = formatTimeStamp(info.event.start);
    const id = info.event.id;

    // if same as prev selected, do noting
    const a = date === formik.values.date;
    const b = id === formik.values.doctorId;
    if (a && b) return;

    const ts = schedules.filter((i) => {
      const matchId = i.id === id;
      const matchDate = formatTimeStamp(i.start) === date;
      return matchId && matchDate;
    });

    formik.setFieldValue("doctorId", id, false);
    formik.setFieldValue("date", date, false);
    formik.setFieldValue("startTime", "", false);
    setSelectedDate(info.event.start);
    setTimeslots(ts);
  };

  const handleTimeSelect = (e) => {
    formik.setFieldValue("startTime", e.target.value, false);
  };

  const handleSave = () => {
    formik.submitForm();
  };

  const handleCalendarPrev = () => {
    setBaseDate((prev) => {
      const v = subMonths(prev, 1);
      const s = startOfMonth(v);
      let d = isWeekend(s) ? addBusinessDays(s, 1) : s;
      formik.setFieldValue("doctorId", "", false);
      formik.setFieldValue("date", "", false);
      formik.setFieldValue("startTime", "", false);
      setSelectedDate(d);
      setTimeslots([]);
      return v;
    });
  };

  const handleCalendarNext = () => {
    setBaseDate((prev) => {
      const v = addMonths(prev, 1);
      const s = startOfMonth(v);
      let d = isWeekend(s) ? addBusinessDays(s, 1) : s;
      formik.setFieldValue("doctorId", "", false);
      formik.setFieldValue("date", "", false);
      formik.setFieldValue("startTime", "", false);
      setSelectedDate(d);
      setTimeslots([]);
      return v;
    });
  };
  return (
    <Box sx={{ pt: 2, display: "flex", flexDirection: "row", gap: 2 }}>
      <Box sx={{ width: 400 }}>
        <Select
          required
          label="Service"
          value={formik.values.serviceId}
          onChange={(e) => {
            formik.resetForm();
            formik.setFieldValue("serviceId", e.target.value, false);
            setDoctors([]);
            setSchedules([]);
          }}
        >
          {services.map(({ id, name, description }) => (
            <MenuItem key={id} value={id}>
              <Tooltip title={description} placement="top-end">
                <ListItemText primary={name} />
              </Tooltip>
            </MenuItem>
          ))}
        </Select>

        {displayTimepicker && (
          <TimePicker
            date={selectedDate}
            data={timeslots}
            doctor={doctorsMap[formik.values.doctorId]}
            doctorId={formik.values.doctorId}
            patientId={user.id}
            appointments={appointments}
            selected={formik.values.startTime}
            onTimeselect={handleTimeSelect}
          />
        )}
      </Box>

      {/* , mt: "-24px" */}
      <Box sx={{ flex: 1 }}>
        {displayCalendar && (
          <>
            {/* <Box>
              <Button
                variant="contained"
                size="small"
                onClick={handleSave}
                disabled={disabledSave}
              >
                submit appointment
              </Button>
            </Box> */}
            <Header
              selectedDate={baseDate}
              handleCalendarPrev={handleCalendarPrev}
              handleCalendarNext={handleCalendarNext}
              prevDisabled={prevDisabled}
              nextDisabled={nextDisabled}
              handleSave={handleSave}
              disabledSave={disabledSave}
            />
            <Calendar
              height="calc(100vh - 180px)"
              doctorsMap={doctorsMap}
              date={baseDate}
              events={schedules}
              eventClick={handleDoctorClick}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default ScheduleAppointmentPage;

const idNameMap = (a, i) => {
  a[i.id] = i.name;
  return a;
};

// const getMyAppointments = (id, data) => {
//   data = data.filter((i) => !i.rejected);

//   // const forApproval = data.filter((i) => {
//   //   const a = i.patientId === id;
//   //   const b = i.status === REQUEST_STATUS.forapproval;
//   //   return a && b;
//   // });

//   // const approved = data.filter((i) => {
//   //   const a = i.patientId === id;
//   //   const b = i.status === REQUEST_STATUS.approved;
//   //   return a && b;
//   // });

//   // const others = data.filter((i) => {
//   //   const a = i.patientId !== id;
//   //   return a && b;
//   // });

//   // console.log({ forApproval, approved, others });
//   data = data.filter((i) => !i.rejected);
//   const res = data.map((i) => {
//     let type = i.patientId === id ? i.status : "others";
//     return { ...i, type };
//   });

//   return res;
// };
