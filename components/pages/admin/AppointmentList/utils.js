import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getWeek,
  isAfter,
  isBefore,
  isWithinInterval,
  startOfMonth,
} from "date-fns";

import { REQUEST_STATUS } from "../../../../components/shared";
import { formatTimeStamp } from "../../../../modules/helper";

export const getSlots = ({ schedules, appointments }) => {
  return schedules.reduce(
    (acc, i) => {
      const rangeId = getRangeId({ start: i.start, end: i.end });
      const interval = { start: new Date(i.start), end: new Date(i.end) };

      const takenSlots = appointments.filter((j) => {
        const date = new Date(`${j.date} ${j.startTime}`);
        const isWithin = isWithinInterval(date, interval);
        return isWithin;
      });

      return {
        ...acc,
        // forApproval
        forApproval: {
          ...acc.forApproval,
          [rangeId]: takenSlots.filter(
            (j) => j.status === REQUEST_STATUS.forapproval
          ),
        },
        // approved
        approved: {
          ...acc.approved,
          [rangeId]: takenSlots.filter(
            (j) => j.status === REQUEST_STATUS.approved
          ),
        },
      };
    },
    { forApproval: {}, approved: {} }
  );
};

export const getRangeId = ({ start, end }) => {
  const startD = formatTimeStamp(start, "HH:mm");
  const endD = formatTimeStamp(end, "HH:mm");
  const date = formatTimeStamp(start, "yyyy-MM-dd");
  const rangeId = `${date} ${startD} - ${endD}`;
  return rangeId;
};

export const checkSlotAppointment = ({ start, end, slots }) => {
  const rangeId = getRangeId({ start, end });
  const forApproval = slots.forApproval?.[rangeId]?.length;
  const approved = slots.approved?.[rangeId]?.length;
  return forApproval || approved;
};

export const getPreviousDateBgEvents = (date) => {
  const today = new Date();

  const s = startOfMonth(date);
  const e = endOfMonth(date);

  const within = isWithinInterval(today, {
    start: s,
    end: e,
  });

  const after = isAfter(today, date);

  let bgEvents = [];
  if (within) {
    bgEvents = eachDayOfInterval({
      start: s,
      end: today,
    });
  } else if (after) {
    bgEvents = eachDayOfInterval({
      start: s,
      end: e,
    });
  }

  const res = bgEvents
    // prev dates
    .map((i) => ({
      start: formatTimeStamp(i),
      display: "background",
      backgroundColor: "#CFD2CF",
    }))
    // today
    .concat([
      {
        start: formatTimeStamp(today),
        display: "background",
        backgroundColor: "#15a446",
      },
    ]);

  return res;
};
