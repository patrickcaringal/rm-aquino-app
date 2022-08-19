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
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useFormik } from "formik";
import lodash from "lodash";

import { successMessage } from "../../../../components/common";
import { Input } from "../../../../components/common/Form";
import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { addAppointmentReq, db } from "../../../../modules/firebase";
import { formatTimeStamp, today } from "../../../../modules/helper";
import PlaceholderComponent from "./Placeholder";
import TimeslotComponent from "./Timeslot";
import { getMyForApprovalAppointments } from "./utils";

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
  const { user } = useAuth();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [addAppointment] = useRequest(addAppointmentReq, setBackdropLoader);

  // Local States
  const [schedules, setSchedules] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [takenTimeslots, setTakenTimeslots] = useState({}); // TODO: convert to non state
  const [userTimeslots, setUserTakenTimeslots] = useState(); // TODO: convert to non state

  const formik = useFormik({
    initialValues: {
      date: "",
      startTime: "",
      reasonAppointment: "",
    },
    validateOnChange: false,
    onSubmit: async (values, { setFieldValue }) => {
      const { date, startTime, reasonAppointment } = values;
      const endTimeEstimate = formatTimeStamp(
        addMinutes(new Date(`${date} ${startTime}`), 30),
        "hh:mm a"
      );

      const document = {
        ...values,
        endTimeEstimate,
        weekNo: getWeek(new Date(date)),
        reasonAppointment: reasonAppointment.trim(),
        // user
        patientId: user.id,
        patientEmail: user.email,
        patientName: user.name,
        approved: false,
        rejected: false,
        // contactNo
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

  const { values, setFieldValue, handleBlur, submitForm, touched, errors } =
    formik;

  const selectedDate = values.date;
  const selectedTimeslot = values.startTime;

  const forApprovalTimeslot = getMyForApprovalAppointments({
    data: appointments,
    isArray: false,
  });

  useEffect(() => {
    const weeks = getNext2DaysWeekNo();
    const q = query(collection(db, "schedules"), where("weekNo", "in", weeks));

    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length > 0) {
        const data = querySnapshot.docs.reduce((acc, doc) => {
          const weekSched = doc.data();

          const availSched = weekSched.schedules.reduce((acc2, i) => {
            // past date
            if (isAfter(startOfToday(), new Date(i.date))) return acc2;

            // future 3days from now onwards
            if (isAfter(new Date(i.date), addBusinessDays(startOfToday(), 3))) {
              return acc2;
            }

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

  useEffect(() => {
    const weeks = getNext2DaysWeekNo();
    const q = query(
      collection(db, "appointments"),
      where("weekNo", "in", weeks),
      where("rejected", "==", false)
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length > 0) {
        let userAppoinment = {};
        const data = querySnapshot.docs.reduce((acc, doc) => {
          const appointment = doc.data();
          const { date, startTime } = appointment;
          if (appointment.patientId === user.id) {
            userAppoinment = {
              ...userAppoinment,
              [date]: userAppoinment[date]
                ? [...userAppoinment[date], startTime]
                : [startTime],
            };
          }

          if (!!acc[date]) {
            return {
              ...acc,
              [date]: [...acc[date], startTime],
            };
          }

          return {
            ...acc,
            [date]: [startTime],
          };
        }, {});

        const appointmentList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTakenTimeslots(data);
        setUserTakenTimeslots(userAppoinment);
        setAppointments(appointmentList);
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNext2DaysWeekNo = () => {
    if (["1", "2", "3"].includes(today.dayOfWeek)) {
      return [today.weekNo];
    }

    return [today.weekNo, today.weekNo + 1];
  };

  const availalbeSchedulesDates = lodash.keys(schedules);

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

  const handleSelectDate = (value) => {
    setFieldValue("date", formatTimeStamp(value));
    setFieldValue("startTime", null);
  };

  const handleSelectTimeslot = (event) => {
    setFieldValue("startTime", event.target.value);
  };

  const handleSave = () => {
    if (!values.date || !values.startTime || !values.reasonAppointment) {
      openResponseDialog({
        type: "WARNING",
        autoClose: true,
        content: "Time slot and Reason for appointment are all required.",
      });
      return;
    }

    submitForm();
  };

  const { AM: AMTimeslot = [], PM: PMTimeslot = [] } = getTimeSlots();
  const noAvailSched = AMTimeslot.length === 0 && PMTimeslot.length === 0;
  const is3DaysFromNow = isAfter(
    new Date(selectedDate),
    addBusinessDays(startOfToday(), 3)
  );

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" size="small" onClick={handleSave}>
          submit appointment
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          mb: 3,
          minHeight: 375,
        }}
      >
        {/* DATEPICKER */}
        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              views={["day"]}
              orientation="landscape"
              // openTo="day"
              value={values.date}
              disablePast
              shouldDisableDate={isWeekend}
              onChange={handleSelectDate}
              renderDay={renderWeekPickerDay}
            />
          </LocalizationProvider>
        </Box>

        {!noAvailSched ? (
          <TimeslotComponent
            selectedDate={selectedDate}
            selectedTimeslot={selectedTimeslot}
            onSelectTimeslot={handleSelectTimeslot}
            AMTimeslot={AMTimeslot}
            PMTimeslot={PMTimeslot}
            unavailableTimeslots={takenTimeslots[selectedDate]}
            ownedTimeslots={userTimeslots[selectedDate]}
            forApprovalTimeslot={forApprovalTimeslot[selectedDate]}
          />
        ) : (
          <PlaceholderComponent
            is3DaysFromNow={is3DaysFromNow}
            date={selectedDate}
          />
        )}
      </Box>

      <Box>
        <Input
          multiline
          rows={3}
          value={values.reasonAppointment}
          required
          label="Reason for appointment"
          name="reasonAppointment"
          onChange={(e) =>
            setFieldValue("reasonAppointment", e.target.value.toUpperCase())
          }
          onBlur={handleBlur}
          error={touched.reasonAppointment && errors.reasonAppointment}
        />
      </Box>
    </Box>
  );
};

export default ScheduleAppointmentPage;
