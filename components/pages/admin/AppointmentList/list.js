// // TODELETE duplicate myAppro
// import React, { useEffect, useState } from "react";

// import ThumbDownIcon from "@mui/icons-material/ThumbDown";
// import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// import {
//   Box,
//   Button,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import { useRouter } from "next/router";

// import { useAuth } from "../../../../contexts/AuthContext";
// import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
// import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
// import useRequest from "../../../../hooks/useRequest";
// import {
//   approveAppointmentReq,
//   getAppointmentByDateStatusReq,
//   rejectAppointmentReq,
// } from "../../../../modules/firebase";
// import {
//   formatTimeStamp,
//   getNearestBusinessDay,
// } from "../../../../modules/helper";
// import { LongTypography, successMessage } from "../../../common";
// import { REQUEST_STATUS, RejectModal, RequestStatus } from "../../../shared";
// import Filters from "./Filters";
// import useFilter from "./useFilter";

// const defaultModal = {
//   open: false,
//   data: {},
// };

// const AppointmentsPage = () => {
//   const router = useRouter();
//   const { user } = useAuth();
//   const { openResponseDialog, openErrorDialog, closeDialog } =
//     useResponseDialog();
//   const { setBackdropLoader } = useBackdropLoader();

//   // Requests
//   const [getAppointments] = useRequest(
//     getAppointmentByDateStatusReq,
//     setBackdropLoader
//   );
//   const [approveAppointment] = useRequest(
//     approveAppointmentReq,
//     setBackdropLoader
//   );
//   const [rejectAppointment] = useRequest(
//     rejectAppointmentReq,
//     setBackdropLoader
//   );

//   // Local States
//   const [appointments, setAppointments] = useState([]);
//   const [rejectModal, setRejectModal] = useState(defaultModal);

//   const baseDay = getNearestBusinessDay(router.query?.date);
//   const { filtered, setData, filters, onStatusChange, onDateChange } =
//     useFilter({
//       defaultStatus: "all",
//       defaultDate: baseDay,
//     });

//   useEffect(() => {
//     setData(appointments);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [appointments]);

//   useEffect(() => {
//     // Get
//     const fetch = async () => {
//       const payload = {
//         date: filters.date,
//         status: [REQUEST_STATUS.approved],
//       };
//       const { data, error } = await getAppointments(payload);
//       if (error) return openErrorDialog(error);

//       setAppointments(data);
//     };

//     fetch();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters.date]);

//   return (
//     <Box sx={{ pt: 2 }}>
//       <Filters
//         filters={filters}
//         onStatusChange={onStatusChange}
//         onDateChange={onDateChange}
//         displayStatus={false}
//       />
//       <Box>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {[
//                   { text: "Patient Name" },
//                   { text: "Appointment Date", sx: { width: 210 } },
//                   { text: "Appointment Time", sx: { width: 180 } },
//                   { text: "Doctor", sx: { width: 360 } },
//                   { text: "Status", sx: { width: 160 } },
//                   { text: "Actions", align: "center", sx: { width: 110 } },
//                 ].map(({ text, align, sx }) => (
//                   <TableCell
//                     key={text}
//                     {...(align && { align })}
//                     sx={{ ...sx, fontWeight: "bold" }}
//                   >
//                     {text}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {filtered.map((i) => {
//                 const {
//                   id,
//                   date,
//                   startTime,
//                   endTimeEstimate,
//                   status,
//                   doctor,
//                   service,
//                   patientName,
//                 } = i;
//                 console.log(JSON.stringify(i, null, 4));

//                 return (
//                   <TableRow key={id}>
//                     <TableCell>{patientName}</TableCell>
//                     <TableCell>
//                       {formatTimeStamp(date, "MMM dd, yyyy (EEEE)")}
//                     </TableCell>
//                     <TableCell>
//                       {startTime} - {endTimeEstimate}
//                     </TableCell>
//                     <TableCell>
//                       {doctor} <br />
//                       {service}
//                     </TableCell>
//                     <TableCell>
//                       <RequestStatus status={status} />
//                     </TableCell>
//                     <TableCell align="center"></TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//       {rejectModal.open && (
//         <RejectModal
//           open={rejectModal.open}
//           data={rejectModal.data}
//           content={rejectModalContent()}
//           title="Reject Appointment"
//           onClose={handleRejectModalClose}
//           onReject={handleReject}
//         />
//       )}
//     </Box>
//   );
// };

// export default AppointmentsPage;
