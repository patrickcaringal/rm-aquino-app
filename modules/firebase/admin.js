import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

import {
  formatFirebasetimeStamp,
  getFullName,
  getUniquePersonId,
  pluralize,
} from "../helper";
import { getErrorMsg } from "./auth";
import { auth, db, secondaryAuth, timestampFields } from "./config";

const collRef = collection(db, "admins");

export const signInAdminReq = async ({ email, password }) => {
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
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const signOutReq = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getStaffsReq = async () => {
  try {
    // TODO: adjust when get branch needed
    const q = query(collRef, where("role", "==", "staff"));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc, index) => ({
      index,
      ...doc.data(),
    }));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addStaffReq = async ({ staffs }) => {
  try {
    // Check email duplicate
    let q = query(
      collRef,
      where(
        "email",
        "in",
        staffs.map((i) => i.email)
      )
    );
    let querySnapshot = await getDocs(q);

    let isDuplicate = querySnapshot.docs.length !== 0;
    if (isDuplicate) {
      const duplicates = querySnapshot.docs.map((i) => i.data().email);
      throw new Error(
        `Duplicate ${pluralize(
          "Staff email",
          duplicates.length
        )} (${duplicates.join(", ")})`
      );
    }

    // Check fullname, birthdate duplicate
    q = query(
      collRef,
      where(
        "nameBirthdate",
        "in",
        staffs.map((i) => getUniquePersonId(i))
      )
    );
    querySnapshot = await getDocs(q);

    isDuplicate = querySnapshot.docs.length !== 0;
    if (isDuplicate) {
      const duplicates = querySnapshot.docs.map((i) => i.data().name);
      throw new Error(
        `Duplicate ${pluralize("Staff", duplicates.length)} (${duplicates.join(
          ", "
        )})`
      );
    }

    const batch = writeBatch(db);

    // Bulk Create Auth Account
    for (let index = 0; index < staffs.length; index++) {
      const staffdoc = { ...staffs[index] };
      const { birthdate: rawBirthdate, email } = staffdoc;

      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        "12345678"
      );

      const fullName = getFullName(staffdoc);
      const birthdate = formatFirebasetimeStamp(rawBirthdate);

      staffdoc = {
        ...staffdoc,
        id: uid,
        nameBirthdate: getUniquePersonId(staffdoc), // unique identifier
        name: fullName,
        birthdate,
        role: "staff",
        ...timestampFields({ dateCreated: true, dateUpdated: true }),
      };

      batch.set(doc(db, "admins", uid), staffdoc);

      staffs[index] = { ...staffdoc };
    }

    // Bulk Create Account Document
    await batch.commit();

    return { data: staffs, success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
