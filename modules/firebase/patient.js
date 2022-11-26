import axios from "axios";
import bcrypt from "bcryptjs";
import faker from "faker";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { sendEmail } from "../email";
import { getBaseApi, getBaseUrl } from "../env";
import {
  formatFirebasetimeStamp,
  getFullName,
  getUniquePersonId,
  sortBy,
} from "../helper";
import { getErrorMsg } from "./auth";
import { auth, db, secondaryAuth, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";

const collRef = collection(db, "patients");

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(6);
  const hashed = bcrypt.hashSync(password, salt);
  return hashed;
};

export const signInPatientReq = async ({ email, password }) => {
  try {
    // Get Document
    const q = query(collRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    const exist = querySnapshot.docs.length === 1;
    if (exist) {
      if (querySnapshot.docs[0].data().verified === false)
        throw new Error("Account is yet to be verified");
    }

    // Authenticate
    await signInWithEmailAndPassword(auth, email, password);

    if (!exist) throw new Error("Account not found");

    const document = querySnapshot.docs[0].data();

    return { data: document, success: true };
  } catch (error) {
    console.log(error);
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
      // password: hashPassword(document.password),
      role: "patient",
      deleted: false,
      verified: false,
      approved: false,
      ...timestampFields({ dateCreated: true, dateUpdated: true }),
    };

    // Create Document
    await setDoc(docRef, data);

    const payload = {
      to: data.email,
      name: data.name,
      link: getBaseUrl(`/email-verification/${data.id}`),
    };

    // send verification email
    await axios.post(getBaseApi("/verification-email"), payload);

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getPatientReq = async ({ id }) => {
  try {
    // Get Patient
    const q = doc(db, "patients", id);
    const querySnapshot = await getDoc(q);

    if (!querySnapshot.exists()) {
      throw new Error("Unable to get Patient doc");
    }

    const data = querySnapshot.data();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getPatientsReq = async () => {
  try {
    const q = query(
      collRef,
      where("approved", "==", true),
      where("deleted", "==", false)
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(sortBy("dateCreated"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getPatientsAccountApprovalReq = async () => {
  try {
    const q = query(
      collRef,
      where("approved", "==", false),
      // where("verified", "==", true),
      where("deleted", "==", false)
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(sortBy("dateCreated"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const verifyPatientEmailReq = async ({ id }) => {
  try {
    // Get Patient
    const q = doc(db, "patients", id);
    const querySnapshot = await getDoc(q);

    if (!querySnapshot.exists()) {
      throw new Error("Unable to get Patient doc");
    }

    const document = querySnapshot.data();

    if (!!document.verified) {
      throw new Error("Patient email already verified");
    }

    const password = faker.internet.password(8, false, /[a-z]/);
    // Create Auth Account
    const {
      user: { uid },
    } = await createUserWithEmailAndPassword(
      secondaryAuth,
      document.email,
      password
    );

    // Update to approved
    const batch = writeBatch(db);
    const docRef = doc(db, "patients", document.id);
    const data = {
      authId: uid,
      approved: true,
      verified: true,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, data);

    // Register Patient name
    const { namesDocRef, names } = await registerNames({
      collectionName: "patients",
      names: { [document.id]: document.name },
    });
    batch.update(namesDocRef, names);

    await batch.commit();

    // send email
    const payload = {
      name: document.name,
      email: document.email,
      password,
      link: getBaseUrl("/signin"),
    };
    await sendEmail("/approve-patient", payload);

    return { data: document, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const approvePatientReq = async ({ document }) => {
  try {
    const password = faker.internet.password(8, false, /[a-z]/);
    // Create Auth Account
    const {
      user: { uid },
    } = await createUserWithEmailAndPassword(
      secondaryAuth,
      document.email,
      password
    );

    // Update to approved
    const batch = writeBatch(db);
    const docRef = doc(db, "patients", document.id);
    const data = {
      authId: uid,
      approved: true,
      approvedBy: document.approvedBy,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, data);

    // Register Patient name
    const { namesDocRef, names } = await registerNames({
      collectionName: "patients",
      names: { [document.id]: document.name },
    });
    batch.update(namesDocRef, names);

    await batch.commit();

    // send email
    const payload = {
      name: document.name,
      email: document.email,
      password,
      link: getBaseUrl("/signin"),
    };
    await sendEmail("/approve-patient", payload);

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const rejectPatientReq = async ({ document }) => {
  try {
    // Delete
    const docRef = doc(db, "patients", document.id);
    await deleteDoc(docRef);

    // send email
    const payload = {
      name: document.name,
      email: document.email,
      reason: document.reason,
    };
    await sendEmail("/reject-patient", payload);

    return { data: document, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const forgotPasswordReq = async ({ email }) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: true };
    console.log(error);
    return { error: error.message };
  }
};
