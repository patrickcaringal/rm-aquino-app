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
  writeBatch,
} from "firebase/firestore";

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
    const q = query(
      collRef,
      where("approved", "==", false),
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

export const approvePatientReq = async ({ document }) => {
  try {
    // Create Auth Account
    const {
      user: { uid },
    } = await createUserWithEmailAndPassword(
      secondaryAuth,
      document.email,
      "12345678" // TODO: auto generate
    );

    // TODO: add send email

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

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const rejectPatientReq = async ({ document }) => {
  try {
    // TODO: add send email

    // Delete
    const docRef = doc(db, "patients", document.id);
    await deleteDoc(docRef);

    return { data: document, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
