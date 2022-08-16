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
import TimeslotComponent from "./Timeslot";

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

  const formik = useFormik({
    initialValues: {
      date: "",
      startTime: "",
      reasonAppointment: "",
    },
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
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
        // contactNo
      };

      // Add Appointment
      const payload = { document };
      const { data: newDocs, error: addError } = await addAppointment(payload);
      if (addError) return openErrorDialog(addError);

      // Successful
      openResponseDialog({
        autoClose: true,
        content: successMessage({
          noun: "Appointment",
          verb: "submitted",
        }),
        type: "SUCCESS",
      });
    },
  });

  const { values, setFieldValue, handleBlur, submitForm, touched, errors } =
    formik;

  const selectedDate = values.date;
  const selectedTimeslot = values.startTime;

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

  const getNext2DaysWeekNo = () => {
    if (["1", "2", "3"].includes(today.dayOfWeek)) {
      return [today.weekNo];
    }

    return [today.weekNo, today.weekNo + 1];
  };

  const availalbeSchedulesDates = lodash.keys(schedules);

  // const notAvailalbeSchedulesDates = [
  //   formatTimeStamp(new Date(new Date().valueOf() + 1000 * 3600 * 48)),
  // ];

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
          gap: 3,
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
              disablePast
              value={null}
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
          />
        ) : (
          // Placeholder
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {is3DaysFromNow ? (
              <>
                <Typography variant="h6" gutterBottom>
                  {selectedDate &&
                    formatTimeStamp(selectedDate, "MMM dd, yyyy (EEEE)")}{" "}
                </Typography>
                <Typography gutterBottom>
                  Appointment of schedule for this day will be available on{" "}
                  {formatTimeStamp(
                    subBusinessDays(new Date(selectedDate), 2),
                    "MMM dd, yyyy (EEEE)"
                  )}
                </Typography>
              </>
            ) : selectedDate ? (
              <Typography variant="h6">
                No schedule for{" "}
                {selectedDate &&
                  formatTimeStamp(selectedDate, "MMM dd, yyyy (EEEE)")}{" "}
              </Typography>
            ) : (
              <Typography variant="h6">Select a date</Typography>
            )}
          </Box>
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