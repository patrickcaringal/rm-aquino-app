import bcrypt from "bcryptjs";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
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
import { getErrorMsg } from "./auth";
import { auth, db, secondaryAuth, timestampFields } from "./config";
import { checkDuplicate } from "./helpers";

const collRef = collection(db, "patients");

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(6);
  const hashed = bcrypt.hashSync(password, salt);
  return hashed;
};

export const signInPatientReq = async ({ email, password }) => {
  try {
    // Authenticate
    await signInWithEmailAndPassword(auth, email, password);

    // Get Document
    const q = query(collRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    const exist = querySnapshot.docs.length === 1;
    if (!exist) throw new Error("Account not found");

    const document = querySnapshot.docs[0].data();

    return { data: document, success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const createPatientAccountReq = async ({ document }) => {
  try {
    // Check email duplicate
    await checkDuplicate({
      collectionName: "patients",
      whereClause: where("email", "==", document.email),
      duplicateOutputField: "email",
      errorMsg: {
        noun: "Email",
      },
    });

    // Check duplicate
    await checkDuplicate({
      collectionName: "patients",
      whereClause: where("nameBirthdate", "==", document.nameBirthdate),
      errorMsg: {
        noun: "Patient",
      },
    });

    // Transform Document
    const docRef = doc(collRef);
    const data = {
      id: docRef.id,
      ...document,
      password: hashPassword(document.password),
      deleted: false,
      ...timestampFields({ dateCreated: true, dateUpdated: true }),
    };

    // Create Document
    await setDoc(docRef, data);

    return { data, success: true };
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

export const rejectPatientReq = async ({ patient }) => {
  try {
    // TODO: add send email
    // patient.reason

    // Delete
    const docRef = doc(db, "patients", patient.id);
    await deleteDoc(docRef);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
