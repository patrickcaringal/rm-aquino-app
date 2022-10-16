import React from "react";

import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import lodash from "lodash";

import { formatTimeStamp } from "../../../../modules/helper";

const eventTitle = ({ start, end }) => {
  const f = "hh:mmaaa";
  const title = `${formatTimeStamp(start, f)} - ${formatTimeStamp(end, f)}`;
  return title;
};

const Calendar = ({
  doctorsMap,
  date,
  events,
  height = "calc(100vh - 300px)",
  onDateClick,
  eventClick,
}) => {
  // events = events.map((i) => ({
  //   ...i,
  //   title: `DR. ${doctorsMap[i.id]}`,
  // }));

  const uniq = new Set();
  events = events
    .reduce((a, i) => {
      const d = `${formatTimeStamp(i.start)}${i.id}`;
      if (uniq.has(d)) return a;

      uniq.add(d);
      return [...a, i];
    }, [])
    .map((i) => ({
      ...i,
      title: `DR. ${doctorsMap[i.id]}`,
    }));

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        height={height}
        displayEventTime={false}
        headerToolbar={{
          start: "", // will normally be on the left. if RTL, will be on the right
          center: "",
          end: "", // will normally be on the right. if RTL, will be on the left
        }}
        fixedWeekCount={false}
        dayMaxEvents={3}
        // dynamic
        initialDate={date}
        events={events}
        eventClick={eventClick}
        dateClick={onDateClick}
      />
    </>
  );
};

export default Calendar;
