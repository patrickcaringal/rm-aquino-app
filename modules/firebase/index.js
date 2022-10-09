import {
  addDoctorReq,
  addStaffReq,
  getDoctorReq,
  getDoctorsReq,
  getStaffsReq,
  signInAdminReq,
  updateDoctorReq,
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
  verifyPatientEmailReq,
} from "./patient";
import {
  addSchedulesReq,
  getScheduleByDoctorReq,
  getScheduleReq,
  updateSchedulesReq,
} from "./schedules";
import {
  addServiceReq,
  deleteServiceReq,
  getDeletedServicesReq,
  getServicesReq,
  restoreServiceReq,
  updateServiceReq,
} from "./services";
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
  // services
  addServiceReq,
  deleteServiceReq,
  getDeletedServicesReq,
  getServicesReq,
  restoreServiceReq,
  updateServiceReq,
  // patient
  approvePatientReq,
  createPatientAccountReq,
  getPatientReq,
  getPatientsAccountApprovalReq,
  getPatientsReq,
  rejectPatientReq,
  signInPatientReq,
  verifyPatientEmailReq,
  // admin
  addDoctorReq,
  addStaffReq,
  getDoctorReq,
  getDoctorsReq,
  getStaffsReq,
  signInAdminReq,
  updateDoctorReq,
  updateStaffReq,
  // schedules
  addSchedulesReq,
  getScheduleByDoctorReq,
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
