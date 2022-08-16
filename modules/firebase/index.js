import {
  addStaffReq,
  getStaffsReq,
  signInAdminReq,
  updateStaffReq,
} from "./admin";
import { addAppointmentReq } from "./appointment";
import {
  monitorAuthState,
  signInReq,
  // signInAnonymouslyReq,
  // signOutAnonymouslyReq,
  signOutReq,
  signUpReq,
} from "./auth";
import { auth, db } from "./config";
import {
  approvePatientReq,
  createPatientAccountReq,
  getPatientsAccountApprovalReq,
  rejectPatientReq,
  signInPatientReq,
} from "./patient";
import {
  addSchedulesReq,
  getScheduleReq,
  updateSchedulesReq,
} from "./schedules";
import { deleteImageReq, uploadImageReq } from "./storage";

export {
  // auth
  db,
  auth,
  signUpReq,
  signOutReq,
  signInReq,
  // signInAnonymouslyReq,
  // signOutAnonymouslyReq,
  monitorAuthState,
  // storage
  uploadImageReq,
  deleteImageReq,
  // patient
  approvePatientReq,
  createPatientAccountReq,
  getPatientsAccountApprovalReq,
  rejectPatientReq,
  signInPatientReq,
  // admin
  signInAdminReq,
  getStaffsReq,
  addStaffReq,
  updateStaffReq,
  // schedules
  addSchedulesReq,
  getScheduleReq,
  updateSchedulesReq,
  // appointment
  addAppointmentReq,
};
