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
  eachMinuteOfInterval,
  format,
  getWeek,
  isAfter,
  isBefore,
  isSameDay,
  isWeekend,
  startOfToday,
  subBusinessDays,
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
import PlaceholderComponent from "./Placeholder";
import TimeslotComponent from "./Timeslot";
import { getMyAppointments } from "./utils";

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

  const doctorsMap = doctors.reduce((a, i) => {
    a[i.id] = i.name;
    return a;
  }, {});

  const calendarLoading = schedLoading || doctorLoading;

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

  const formik = useFormik({
    initialValues: {
      service: "",
      date: "",
      startTime: "",
      reasonAppointment: "",
    },
    validateOnChange: false,
    onSubmit: async (values, { setFieldValue }) => {
      // const { date, startTime, reasonAppointment } = values;
      // const endTimeEstimate = formatTimeStamp(
      //   addMinutes(new Date(`${date} ${startTime}`), 30),
      //   "hh:mm a"
      // );
      // const document = {
      //   ...values,
      //   endTimeEstimate,
      //   weekNo: getWeek(new Date(date)),
      //   reasonAppointment: reasonAppointment.trim(),
      //   // user
      //   patientId: user.id,
      //   patientEmail: user.email,
      //   patientName: user.name,
      //   status: REQUEST_STATUS.forapproval,
      //   approved: false,
      //   rejected: false,
      //   // contactNo
      // };
      // // Add Appointment
      // const payload = { document };
      // const { data, error: addError } = await addAppointment(payload);
      // if (addError) return openErrorDialog(addError);
      // // Successful
      // openResponseDialog({
      //   autoClose: true,
      //   content: successMessage({
      //     noun: "Appointment",
      //     verb: "submitted",
      //   }),
      //   type: "SUCCESS",
      //   closeCb() {
      //     setFieldValue("startTime", "");
      //     setFieldValue("reasonAppointment", "");
      //   },
      // });
    },
  });

  useLayoutEffect(() => {
    if (!!formik.values.service) {
      const fetch = async () => {
        // Get Doctors
        const payload = { services: [formik.values.service] };
        const { data, error: getError } = await getDoctors(payload);
        if (getError) return openErrorDialog(getError);

        setDoctors(data);
        if (data.length > 0) fetchSchedule(data);
      };

      const fetchSchedule = async (d) => {
        // Get Sched
        const payload = { ids: d.map((i) => i.id), monthNo: getMonthNo() };
        const { data, error: getError } = await getSchedule(payload);
        if (getError) return openErrorDialog(getError);

        // Combine schedules
        const sched = data.reduce((a, i) => {
          // combine per time slot
          const s = i.schedules.reduce((b, j) => {
            // get only 1 sched from the day, need only 1 for display in calendar
            const c =
              j.schedules.length > 0
                ? { ...j.schedules[0], doctor: i.doctorId } // insert doctor name on sched
                : null;
            return c ? [...b, c] : b;
          }, []);

          // combine per doctor
          return [...a, ...s];
        }, []);

        setSchedules(sched);
      };

      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.service]);

  // useLayoutEffect(() => {
  //   if (doctors.length > 0) {
  //     const fetch = async () => {
  //       // Get Sched
  //       const payload = {
  //         ids: doctors.map((i) => i.id),
  //         monthNo: getMonthNo(),
  //       };
  //       const { data, error: getError } = await getSchedule(payload);
  //       if (getError) return openErrorDialog(getError);

  //       // Combine schedules
  //       const sched = data.reduce((a, i) => {
  //         const s = i.schedules.reduce((b, j) => {
  //           return [...b, ...j.schedules];
  //         }, []);
  //         return [...a, ...s];
  //       }, []);

  //       setSchedules(sched);
  //       // data?.schedules?.reduce((acc, i) => {
  //       //   return [...acc, ...i.schedules];
  //       // }, []) || []
  //       // setDoctors(data);
  //     };

  //     fetch();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [doctors]);

  return (
    <Box sx={{ pt: 2 }}>
      <Box>
        <Select
          sx={{ width: 400 }}
          required
          label="Service"
          value={formik.values.service}
          onChange={(e) => {
            formik.setFieldValue("service", e.target.value, false);
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
      </Box>

      <Box>
        {formik.values.service && !calendarLoading && (
          <Calendar
            doctorsMap={doctorsMap}
            date={selectedDate}
            events={schedules}
            // onDateClick={handleDateClick}
          />
        )}
      </Box>
    </Box>
  );
};

export default ScheduleAppointmentPage;
