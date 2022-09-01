import {
  Timestamp,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { REQUEST_STATUS } from "../../components/shared";
import { formatTimeStamp, pluralize, sortBy } from "../helper";
import { getErrorMsg } from "./auth";
import { db, timestampFields } from "./config";

const collRef = collection(db, "appointments");

export const getAppointmentReq = async () => {
  try {
    const q = query(collRef, where("deleted", "==", false));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(sortBy("dateCreated", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getAppointmentByDateReq = async ({ date }) => {
  try {
    const q = query(
      collRef,
      where("date", "==", date),
      where("status", "==", REQUEST_STATUS.approved),
      where("deleted", "==", false)
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // .sort(sortBy("dateCreated", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getAppointmentForApprovalReq = async () => {
  try {
    const q = query(
      collRef,
      where("deleted", "==", false),
      where("status", "==", REQUEST_STATUS.forapproval)
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(sortBy("dateCreated", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getPatientAppointmentReq = async ({ id }) => {
  try {
    const q = query(
      collRef,
      where("patientId", "==", id),
      where("deleted", "==", false)
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(sortBy("dateCreated", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addAppointmentReq = async ({ document }) => {
  try {
    const docRef = doc(collRef);
    const data = {
      id: docRef.id,
      ...document,
      dateTimestamp: Timestamp.fromDate(
        new Date(`${document.date} ${document.startTime}`)
      ),
      deleted: false,
      ...timestampFields({ dateCreated: true, dateUpdated: true }),
    };

    // Create Document
    await setDoc(docRef, data);

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const approveAppointmentReq = async ({ document }) => {
  try {
    const docRef = doc(db, "appointments", document.id);
    const data = {
      status: REQUEST_STATUS.approved,
      approved: true,
      approvedBy: document.approvedBy,
      ...timestampFields({ dateUpdated: true }),
    };
    // Update Document
    await updateDoc(docRef, data);

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const rejectAppointmentReq = async ({ document }) => {
  try {
    // TODO: add send email

    const docRef = doc(db, "appointments", document.id);
    const data = {
      status: REQUEST_STATUS.rejected,
      rejected: true,
      rejectedBy: document.rejectedBy,
      reasonReject: document.reason,
      ...timestampFields({ dateUpdated: true }),
    };
    // Update Document
    await updateDoc(docRef, data);

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const diagnosePatientReq = async ({ document }) => {
  try {
    const batch = writeBatch(db);

    // Create Medical Record
    const docRef = doc(collection(db, "medicalRecords"));
    const data = {
      id: docRef.id,
      ...document,
      deleted: false,
      ...timestampFields({ dateCreated: true, dateUpdated: true }),
    };
    batch.set(docRef, data);

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
