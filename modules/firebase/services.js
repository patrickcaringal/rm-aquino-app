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

const collRef = collection(db, "services");

export const getServicesReq = async () => {
  try {
    const querySnapshot = await getDocs(collRef);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const map = data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {});

    return { data, map, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addServiceReq = async ({ docs }) => {
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
          "Service",
          duplicates.length
        )}. ${duplicates.join(", ")}`
      );
    }

    // Bulk Create Service Document
    const batch = writeBatch(db);

    const data = docs.map((serviceDoc) => {
      const mappedDoc = {
        ...serviceDoc,
        ...timestampFields({ dateCreated: true, dateUpdated: true }),
      };
      const docRef = doc(collRef);
      batch.set(doc(db, "services", docRef.id), mappedDoc);

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
