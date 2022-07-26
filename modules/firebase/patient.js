import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { formatFirebasetimeStamp, getFullName } from "../helper";
import { db, timestampFields } from "./config";

const collRef = collection(db, "patients");

export const createPatientAccountReq = async (document) => {
  try {
    const fullName = getFullName(document);
    const birthdate = formatFirebasetimeStamp(document.birthdate);

    // Check fullname, birthdate duplicate
    let q = query(
      collRef,
      where("name", "==", fullName),
      where("birthdate", "==", birthdate)
    );
    let querySnapshot = await getDocs(q);

    let isDuplicate = querySnapshot.docs.length !== 0;
    if (isDuplicate) {
      throw new Error(`Patient account ${fullName} already exist.`);
    }

    const { email } = document;

    // Check email duplicate
    q = query(collRef, where("email", "==", email));
    querySnapshot = await getDocs(q);

    isDuplicate = querySnapshot.docs.length !== 0;
    if (isDuplicate) {
      throw new Error(`Email (${email}) already used.`);
    }

    // Transform Document
    const mappedDoc = {
      ...document,
      //   id: docRef.id,
      name: fullName,
      birthdate,
      approved: false,
      role: "patient",
      ...timestampFields({ dateCreated: true, dateUpdated: true }),
    };

    // Create Document
    const docRef = doc(collRef);
    await setDoc(docRef, mappedDoc);

    return { data: mappedDoc, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
