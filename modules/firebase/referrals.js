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

const collectionName = "referrals";
const collRef = collection(db, collectionName);

export const addReferralReq = async ({ document }) => {
  try {
    const docRef = doc(collRef);
    const data = {
      id: docRef.id,
      ...document,
      deleted: false,
      ...timestampFields({ dateCreated: true, dateUpdated: true }),
    };

    await setDoc(docRef, data);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

// export const getPatientRecordReq = async ({ id }) => {
//   try {
//     const q = query(
//       collRef,
//       where("patientId", "==", id),
//       where("deleted", "==", false)
//     );
//     const querySnapshot = await getDocs(q);

//     const data = querySnapshot.docs
//       .map((doc) => ({ ...doc.data() }))
//       .sort(sortBy("dateCreated", "desc"));

//     return { data, success: true };
//   } catch (error) {
//     console.log(error);
//     return { error: error.message };
//   }
// };

// export const getMedicalRecordsReq = async () => {
//   try {
//     const q = query(collRef, where("deleted", "==", false));
//     const querySnapshot = await getDocs(q);

//     const data = querySnapshot.docs
//       .map((doc) => ({ ...doc.data() }))
//       .sort(sortBy("dateCreated", "desc"));

//     return { data, success: true };
//   } catch (error) {
//     console.log(error);
//     return { error: error.message };
//   }
// };
