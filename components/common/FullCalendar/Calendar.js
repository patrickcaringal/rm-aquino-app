/* eslint-disable */
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import lodash from "lodash";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid";

import { today, days } from "../../../modules/helper";

export const formatDateTime = (datetime) => {
  return format(datetime, "yyyy-MM-dd ");
};

const Calendar = ({
  initialDate = new Date(),
  businessHours = [],
  events,
  onTimeSelect,
  onEventClick,
}) => {
  return (
    <FullCalendar
      initialDate={initialDate}
      height={504}
      // plugins={[dayGridPlugin, interactionPlugin]}
      // initialView="timeGridWeek"
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        start: "", // will normally be on the left. if RTL, will be on the right
        center: "",
        end: "", // will normally be on the right. if RTL, will be on the left
      }}
      dayHeaderFormat={{
        weekday: "short",
        month: "short",
        day: "numeric",
        omitCommas: true,
      }}
      weekends={false}
      nowIndicator
      slotMinTime="08:00:00"
      slotMaxTime="17:00:00"
      // scrollTime="08:00:00"
      // hiddenDays={[2, 4]}
      selectable={true}
      selectOverlap={false}
      selectMirror
      selectConstraint="businessHours"
      businessHours={businessHours}
      events={events}
      eventClick={onEventClick}
      select={onTimeSelect}
    />
  );
};

export default Calendar;
