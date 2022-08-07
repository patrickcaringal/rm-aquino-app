import {
  addFamilyMembersReq,
  checkAccountCredentialReq,
  checkAccountDuplicateReq,
  createAccountReq,
  getFamilyMembersReq,
  getMemberForApprovalReq,
  updateFamilyMembersReq,
} from "./account";
import {
  addStaffReq,
  getStaffsReq,
  signInAdminReq,
  updateStaffReq,
} from "./admin";
import {
  monitorAuthState,
  signInAnonymouslyReq,
  signInReq,
  signOutAnonymouslyReq,
  signOutReq,
  signUpReq,
} from "./auth";
import { addBranchReq, getBranchesReq } from "./branches";
import { auth, db } from "./config";
import {
  approvePatientReq,
  createPatientAccountReq,
  getPatientsAccountApprovalReq,
  rejectPatientReq,
  signInPatientReq,
} from "./patient";
import { addServiceReq, getServicesReq } from "./services";
import { deleteImageReq, uploadImageReq } from "./storage";

export {
  // auth
  db,
  auth,
  signUpReq,
  signOutReq,
  signInReq,
  signInAnonymouslyReq,
  signOutAnonymouslyReq,
  monitorAuthState,
  // account
  createAccountReq,
  checkAccountDuplicateReq,
  checkAccountCredentialReq,
  getFamilyMembersReq,
  addFamilyMembersReq,
  updateFamilyMembersReq,
  getMemberForApprovalReq,
  // service
  getServicesReq,
  addServiceReq,
  // branch
  addBranchReq,
  getBranchesReq,
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
};
