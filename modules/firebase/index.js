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
  addAffiliateReq,
  deleteAffiliateReq,
  getAffiliatesReq,
  updateAffiliateReq,
} from "./affiliates";
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
  payAppointmentReq,
  rejectAppointmentReq,
  updateAppointmentReq,
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
import {
  addDiagnosisReq,
  deleteDiagnosisReq,
  getDiagnosisReq,
  updateDiagnosisReq,
} from "./diagnosis";
import {
  getMedicalRecordsReq,
  getPatientRecordReq,
  updateMedicalRecordReq,
} from "./medicalRecords";
import {
  approvePatientReq,
  createPatientAccountReq,
  forgotPasswordReq,
  getPatientReq,
  getPatientsAccountApprovalReq,
  getPatientsReq,
  rejectPatientReq,
  signInPatientReq,
  updatePatientReq,
  verifyPatientEmailReq,
} from "./patient";
import {
  addReferralReq,
  getReferralsByPatientReq,
  getReferralsReq,
} from "./referrals";
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
  getServiceReq,
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
  getServiceReq,
  // patient
  approvePatientReq,
  createPatientAccountReq,
  forgotPasswordReq,
  getPatientReq,
  getPatientsAccountApprovalReq,
  getPatientsReq,
  rejectPatientReq,
  signInPatientReq,
  updatePatientReq,
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
  updateAppointmentReq,
  payAppointmentReq,
  // medical record
  getPatientRecordReq,
  getMedicalRecordsReq,
  updateMedicalRecordReq,
  // affiliate
  addAffiliateReq,
  deleteAffiliateReq,
  getAffiliatesReq,
  updateAffiliateReq,
  // diagnosis
  addDiagnosisReq,
  getDiagnosisReq,
  updateDiagnosisReq,
  deleteDiagnosisReq,
  // referral
  addReferralReq,
  getReferralsReq,
  getReferralsByPatientReq,
};
