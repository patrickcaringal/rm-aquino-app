import React from "react";

import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from "@fullcalendar/react"; // must go before plugins

import { formatTimeStamp } from "../../../../modules/helper";

const eventTitle = ({ start, end }) => {
  const f = "hh:mmaaa";
  const title = `${formatTimeStamp(start, f)} - ${formatTimeStamp(end, f)}`;
  return title;
};

const Calendar = ({ date, events, onDateClick }) => {
  events = events.map((i, idx) => ({
    ...i,
    title: eventTitle(i),
  }));

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        height="calc(100vh - 300px)"
        displayEventTime={false}
        headerToolbar={{
          start: "", // will normally be on the left. if RTL, will be on the right
          center: "",
          end: "", // will normally be on the right. if RTL, will be on the left
        }}
        fixedWeekCount={false}
        dayMaxEvents={1}
        // dynamic
        initialDate={date}
        events={events}
        eventClick={(info) => {
          console.log("eventClick", info.event.id);
        }}
        dateClick={onDateClick}
      />
    </>
  );
};

export default Calendar;
