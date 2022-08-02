import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  formatFirebasetimeStamp,
  getFullName,
  getUniquePersonId,
} from "../helper";
import { db, secondaryAuth, timestampFields } from "./config";

const collRef = collection(db, "patients");

const transformedFields = (doc) => ({
  name: getFullName(doc),
  birthdate: formatFirebasetimeStamp(doc.birthdate),
  nameBirthdate: getUniquePersonId(doc),
});

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
    const docRef = doc(collRef);
    const mappedDoc = {
      ...document,
      id: docRef.id,
      role: "patient",
      approved: false,
      deleted: false,
      ...transformedFields(staffdoc),
      ...timestampFields({ dateCreated: true, dateUpdated: true }),
    };

    // Create Document
    await setDoc(docRef, mappedDoc);

    return { data: mappedDoc, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getPatientsAccountApprovalReq = async () => {
  try {
    // TODO: adjust when get branch needed
    const q = query(
      collRef,
      where("approved", "==", false),
      where("deleted", "==", false)
    );
    const querySnapshot = await getDocs(q);

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

export const approvePatientReq = async ({ patient }) => {
  try {
    // Create Auth Account
    const {
      user: { uid },
    } = await createUserWithEmailAndPassword(
      secondaryAuth,
      patient.email,
      "12345678" // TODO: auto generate
    );

    // TODO: add send email

    // Update ot approved
    const docRef = doc(db, "patients", patient.id);
    const finalDoc = {
      authId: uid,
      approved: true,
      ...timestampFields({ dateUpdated: true }),
    };
    await updateDoc(docRef, finalDoc);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
