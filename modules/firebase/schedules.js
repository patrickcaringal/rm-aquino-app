import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { pluralize } from "../helper";
import { getErrorMsg } from "./auth";
import { db, timestampFields } from "./config";

const collRef = collection(db, "schedules");

export const getScheduleReq = async ({ weekNo }) => {
  try {
    const q = query(collRef, where("weekNo", "==", weekNo));
    const querySnapshot = await getDocs(q);

    let data = {};
    if (querySnapshot.docs.length >= 1) {
      data = querySnapshot.docs[0].data();
    }

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getScheduleByDoctorReq = async ({ id, monthNo }) => {
  try {
    const q = query(
      collRef,
      where("doctorId", "==", id),
      where("monthNo", "==", monthNo)
    );
    const querySnapshot = await getDocs(q);

    let data = {};
    if (querySnapshot.docs.length >= 1) {
      data = querySnapshot.docs[0].data();
    }

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addSchedulesReq = async ({ document }) => {
  try {
    const docRef = doc(collRef);
    const data = {
      id: docRef.id,
      ...document,
      deleted: false,
      ...timestampFields({ dateCreated: true, dateUpdated: true }),
    };

    // Create Document
    await setDoc(docRef, data);

    return { data, success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const updateSchedulesReq = async ({ document }) => {
  try {
    const docRef = doc(db, "schedules", document.id);
    const data = {
      schedules: document.schedules,
      ...timestampFields({ dateUpdated: true }),
    };

    // Update Document
    await updateDoc(docRef, data);

    return { data, success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
