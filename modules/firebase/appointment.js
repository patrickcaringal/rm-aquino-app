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

import { pluralize, sortBy } from "../helper";
import { getErrorMsg } from "./auth";
import { db, timestampFields } from "./config";

const collRef = collection(db, "appointments");

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
