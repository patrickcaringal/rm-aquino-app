import {
  addFamilyMembersReq,
  checkAccountCredentialReq,
  checkAccountDuplicateReq,
  createAccountReq,
  getFamilyMembersReq,
  getMemberForApprovalReq,
  updateFamilyMembersReq,
} from "./account";
import { signInAdminReq } from "./admin";
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
import { createPatientAccountReq } from "./patient";
import { addServiceReq, getServicesReq } from "./services";
import { addStaffReq, getStaffsReq, signInStaffReq } from "./staff";
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
  // staff
  addStaffReq,
  getStaffsReq,
  signInStaffReq,
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
  createPatientAccountReq,
  // admin
  signInAdminReq,
};
