// // TODELETE duplicate myAppro
// import React from "react";

// import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
// import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
// import FullCalendar from "@fullcalendar/react"; // must go before plugins
// import lodash from "lodash";

// import { formatTimeStamp, pluralize } from "../../../../modules/helper";
// import { REQUEST_STATUS } from "../../../shared";

// const Calendar = ({
//   date,
//   events,
//   onDateClick,
//   onEventClick,
//   height = "calc(100vh - 300px)",
// }) => {
//   let approved = events.filter((i) => i.status === REQUEST_STATUS.approved);
//   let forapproval = events.filter(
//     (i) => i.status === REQUEST_STATUS.forapproval
//   );

//   const a = lodash
//     .toPairs(lodash.chain(approved).groupBy("date").value())
//     .map(([k, v]) => {
//       return {
//         start: k,
//         end: k,
//         title: `${v.length} Approved`,
//         backgroundColor: "#15a446",
//         borderColor: "#rgb(14, 114, 49)",
//       };
//     });

//   const b = lodash
//     .toPairs(lodash.chain(forapproval).groupBy("date").value())
//     .map(([k, v]) => {
//       return {
//         start: k,
//         end: k,
//         title: `${v.length} For Approval`,
//         backgroundColor: "#ff9800",
//         borderColor: "#ed6c02",
//       };
//     });

//   events = [...a, ...b];

//   return (
//     <>
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         weekends={false}
//         height={height}
//         displayEventTime={false}
//         headerToolbar={{
//           start: "", // will normally be on the left. if RTL, will be on the right
//           center: "",
//           end: "", // will normally be on the right. if RTL, will be on the left
//         }}
//         fixedWeekCount={false}
//         dayMaxEvents={1}
//         // dynamic
//         initialDate={date}
//         events={events}
//         eventClick={onEventClick}
//         dateClick={onDateClick}
//       />
//     </>
//   );
// };

// export default Calendar;
