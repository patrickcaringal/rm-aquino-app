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
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { duplicateMessage } from "../../components/common";
import {
  arrayStringify,
  formatFirebasetimeStamp,
  getFullName,
  getUniquePersonId,
  pluralize,
} from "../helper";
import { getErrorMsg } from "./auth";
import { auth, db, secondaryAuth, timestampFields } from "./config";

const collRef = collection(db, "admins");

const transformedFields = (doc) => ({
  name: getFullName(doc),
  birthdate: formatFirebasetimeStamp(doc.birthdate),
  nameBirthdate: getUniquePersonId(doc),
});

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
    const q = query(
      collRef,
      where("role", "==", "staff"),
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
        duplicateMessage({
          noun: pluralize("email", duplicates.length),
          item: arrayStringify(duplicates),
        })
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
        duplicateMessage({
          noun: pluralize("Staff", duplicates.length),
          item: arrayStringify(duplicates),
        })
      );
    }

    // Bulk Create Auth Account
    const batch = writeBatch(db);

    for (let index = 0; index < staffs.length; index++) {
      const staffdoc = { ...staffs[index] };

      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(
        secondaryAuth,
        staffdoc.email,
        "12345678"
      );

      staffdoc = {
        ...staffdoc,
        id: uid,
        role: "staff",
        deleted: false,
        ...transformedFields(staffdoc),
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

export const updateStaffReq = async ({ staff }) => {
  try {
    const nameBirthdate = getUniquePersonId(staff);

    // Check fullname, birthdate duplicate
    const q = query(collRef, where("nameBirthdate", "==", nameBirthdate));
    const querySnapshot = await getDocs(q);

    const isDuplicate = querySnapshot.docs.length !== 0;
    // TODO: .filter((doc) => doc.id !== staff.id)
    if (isDuplicate) {
      throw new Error(
        duplicateMessage({
          noun: "Staff",
          item: getFullName(staff),
        })
      );
    }

    // Update
    const docRef = doc(db, "admins", staff.id);
    const finalDoc = {
      ...staff,
      ...transformedFields(staff),
      ...timestampFields({ dateUpdated: true }),
    };
    await updateDoc(docRef, finalDoc);

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
