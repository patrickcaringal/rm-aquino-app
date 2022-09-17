import {
  addStaffReq,
  getStaffsReq,
  signInAdminReq,
  updateStaffReq,
} from "./admin";
import {
  SERVICE_TYPE,
  addAppointmentReq,
  approveAppointmentReq,
  diagnosePatientReq,
  getAppointmentByDateReq,
  getAppointmentForApprovalReq,
  getAppointmentReq,
  getAppointmentsByWeekReq,
  getPatientAppointmentReq,
  rejectAppointmentReq,
} from "./appointment";
import {
  monitorAuthState,
  signInReq,
  // signInAnonymouslyReq,
  // signOutAnonymouslyReq,
  signOutReq,
  signUpReq,
} from "./auth";
import { auth, db } from "./config";
import { getPatientRecordReq } from "./medicalRecords";
import {
  approvePatientReq,
  createPatientAccountReq,
  getPatientReq,
  getPatientsAccountApprovalReq,
  getPatientsReq,
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
  getPatientReq,
  getPatientsAccountApprovalReq,
  getPatientsReq,
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
  SERVICE_TYPE,
  addAppointmentReq,
  approveAppointmentReq,
  diagnosePatientReq,
  getAppointmentByDateReq,
  getAppointmentForApprovalReq,
  getAppointmentReq,
  getAppointmentsByWeekReq,
  getPatientAppointmentReq,
  rejectAppointmentReq,
  // medical record
  getPatientRecordReq,
};
