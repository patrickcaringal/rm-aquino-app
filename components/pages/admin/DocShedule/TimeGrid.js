import React from "react";

import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import timeGridPlugin from "@fullcalendar/timegrid";
import { Box, Button, Typography } from "@mui/material";

import { DATE_FORMAT, formatTimeStamp } from "../../../../modules/helper";

const TimeGrid = ({
  loading,
  date,
  events,
  onTimeSelect,
  onEventClick,
  onSave,
}) => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Typography variant="h6" fontWeight={400} sx={{ flex: 1 }}>
          {formatTimeStamp(date, DATE_FORMAT.med)}
        </Typography>
        <Button variant="contained" size="small" onClick={onSave}>
          save schedule
        </Button>
      </Box>

      {!loading && (
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          weekends={false}
          height="510px"
          slotMinTime="08:00:00"
          slotMaxTime="17:00:00"
          headerToolbar={{
            start: "", // will normally be on the left. if RTL, will be on the right
            center: "",
            end: "", // will normally be on the right. if RTL, will be on the left
          }}
          selectable={true}
          selectOverlap={false}
          selectMirror
          // dynamic
          initialDate={date}
          events={events}
          eventClick={onEventClick}
          select={onTimeSelect}
        />
      )}
    </>
  );
};

export default TimeGrid;
