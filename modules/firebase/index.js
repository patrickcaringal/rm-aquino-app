import {
  addDoctorReq,
  addStaffReq,
  getDoctorReq,
  getDoctorsByServiceReq,
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
  cancelAppointmentReq,
  diagnosePatientReq,
  getAppointmentByDateReq,
  getAppointmentByDateStatusReq,
  getAppointmentForApprovalReq,
  getAppointmentReq,
  getAppointmentsByWeekReq,
  getDoctorAppointmentByDateReq,
  getDoctorAppointmentByMonthReq,
  getPatientAppointmentReq,
  rejectAppointmentReq,
} from "./appointment";
import {
  changePasswordReq,
  getUserReq,
  monitorAuthState,
  signInReq,
  signOutReq,
  signUpReq,
  updateUserReq,
} from "./auth";
import { auth, db } from "./config";
import { getMedicalRecordsReq, getPatientRecordReq } from "./medicalRecords";
import {
  approvePatientReq,
  createPatientAccountReq,
  forgotPasswordReq,
  getPatientReq,
  getPatientsAccountApprovalReq,
  getPatientsReq,
  rejectPatientReq,
  signInPatientReq,
  verifyPatientEmailReq,
} from "./patient";
import {
  addSchedulesReq,
  getDoctorsScheduleReq,
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
  changePasswordReq,
  getUserReq,
  monitorAuthState,
  signInReq,
  signOutReq,
  signUpReq,
  updateUserReq,
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
  forgotPasswordReq,
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
  getDoctorsByServiceReq,
  getDoctorsReq,
  getStaffsReq,
  signInAdminReq,
  updateDoctorReq,
  updateStaffReq,
  // schedules
  addSchedulesReq,
  getDoctorsScheduleReq,
  getScheduleByDoctorReq,
  getScheduleReq,
  updateSchedulesReq,
  // appointment
  SERVICE_TYPE,
  addAppointmentReq,
  approveAppointmentReq,
  cancelAppointmentReq,
  diagnosePatientReq,
  getAppointmentByDateReq,
  getAppointmentByDateStatusReq,
  getAppointmentForApprovalReq,
  getAppointmentReq,
  getAppointmentsByWeekReq,
  getDoctorAppointmentByDateReq,
  getDoctorAppointmentByMonthReq,
  getPatientAppointmentReq,
  rejectAppointmentReq,
  // medical record
  getPatientRecordReq,
  getMedicalRecordsReq,
};
