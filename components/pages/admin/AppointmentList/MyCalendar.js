import React from "react";

import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import { Box } from "@mui/material";
import lodash from "lodash";

import { formatTimeStamp, pluralize } from "../../../../modules/helper";
import { REQUEST_STATUS } from "../../../shared";
import { getPreviousDateBgEvents } from "./utils";

const Calendar = ({
  date,
  events,
  onDateClick,
  onEventClick,
  height = "calc(100vh - 300px)",
}) => {
  let approved = events.filter((i) => i.status === REQUEST_STATUS.approved);
  let forapproval = events.filter(
    (i) => i.status === REQUEST_STATUS.forapproval
  );
  let done = events.filter((i) => i.status === REQUEST_STATUS.done);

  const a = lodash
    .toPairs(lodash.chain(approved).groupBy("date").value())
    .map(([k, v]) => {
      return {
        start: k,
        end: k,
        title: `${v.length} Approved`,
        backgroundColor: "#15a446",
        borderColor: "#rgb(14, 114, 49)",
      };
    });

  const b = lodash
    .toPairs(lodash.chain(forapproval).groupBy("date").value())
    .map(([k, v]) => {
      return {
        start: k,
        end: k,
        title: `${v.length} For Approval`,
        backgroundColor: "#ff9800",
        borderColor: "#ed6c02",
      };
    });

  const c = lodash
    .toPairs(lodash.chain(done).groupBy("date").value())
    .map(([k, v]) => {
      return {
        start: k,
        end: k,
        title: `${v.length} Done`,
        backgroundColor: "#15a446",
        borderColor: "#rgb(14, 114, 49)",
      };
    });

  const bgEvents = getPreviousDateBgEvents(date);

  events = [...a, ...b, ...c, ...bgEvents];

  return (
    <Box sx={{ mt: "-12px" }}>
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
        // dynamic
        initialDate={date}
        events={events}
        eventClick={onEventClick}
        dateClick={onDateClick}
      />
    </Box>
  );
};

export default Calendar;
