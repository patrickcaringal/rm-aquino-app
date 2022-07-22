import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

import { pluralize } from "../helper";
import { getErrorMsg } from "./auth";
import { db, timestampFields } from "./config";

const collRef = collection(db, "branches");

export const getBranchesReq = async () => {
  try {
    const querySnapshot = await getDocs(collRef);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addBranchReq = async ({ docs }) => {
  try {
    const q = query(
      collRef,
      where(
        "name",
        "in",
        docs.map((i) => i.name)
      )
    );
    const querySnapshot = await getDocs(q);

    const isDuplicate = querySnapshot.docs.length !== 0;
    if (isDuplicate) {
      const duplicates = querySnapshot.docs.map((i) => i.data().name);
      throw new Error(
        `Duplicate ${pluralize(
          "Branch",
          duplicates.length,
          "es"
        )}. ${duplicates.join(", ")}`
      );
    }

    // Bulk Create Document
    const batch = writeBatch(db);

    const data = docs.map((d) => {
      const mappedDoc = {
        ...d,
        ...timestampFields({ dateCreated: true, dateUpdated: true }),
      };
      const docRef = doc(collRef);
      batch.set(doc(db, "branches", docRef.id), mappedDoc);

      return mappedDoc;
    });

    await batch.commit();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
