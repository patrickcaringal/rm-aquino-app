import React from "react";

import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import lodash from "lodash";

import { formatTimeStamp, pluralize } from "../../../../modules/helper";

const Calendar = ({
  date,
  events,
  onDateClick,
  onEventClick,
  height = "calc(100vh - 300px)",
}) => {
  const groupedByDate = lodash.chain(events).groupBy("date").value();

  events = lodash.toPairs(groupedByDate).map(([k, v]) => {
    return {
      start: k,
      end: k,
      title: `${v.length} ${pluralize("Appointment", v.length)} for approval`,
    };
  });

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
        dayMaxEvents={1}
        eventBackgroundColor="#ff9800"
        eventBorderColor="#ed6c02"
        // dynamic
        initialDate={date}
        events={events}
        eventClick={onEventClick}
        dateClick={onDateClick}
      />
    </>
  );
};

export default Calendar;
