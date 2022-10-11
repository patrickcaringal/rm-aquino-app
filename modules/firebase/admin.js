import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
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
  sortBy,
} from "../helper";
import { getErrorMsg } from "./auth";
import { auth, db, secondaryAuth, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";

const collectionName = "admins";
const collRef = collection(db, collectionName);

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

export const getDoctorsReq = async () => {
  try {
    const q = query(
      collRef,
      where("role", "==", "doctor"),
      where("deleted", "==", false)
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(sortBy("dateCreated", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getDoctorsByServiceReq = async ({ services }) => {
  try {
    const q = query(
      collRef,
      where("role", "==", "doctor"),
      where("servicesId", "array-contains-any", services)
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(sortBy("dateCreated", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getDoctorReq = async ({ id }) => {
  try {
    const q = doc(db, collectionName, id);
    const querySnapshot = await getDoc(q);

    if (!querySnapshot.exists()) {
      throw new Error("Unable to get Doctor doc");
    }

    const data = querySnapshot.data();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addStaffReq = async ({ docs }) => {
  try {
    // Check email duplicate
    await checkDuplicate({
      collectionName: "admins",
      whereClause: where(
        "email",
        "in",
        docs.map((i) => i.email)
      ),
      duplicateOutputField: "email",
      errorMsg: {
        noun: "Email",
      },
    });

    // Bulk Create Auth Account
    const batch = writeBatch(db);

    for (let index = 0; index < docs.length; index++) {
      let staffdoc = { ...docs[index] };

      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(
        secondaryAuth,
        staffdoc.email,
        "12345678"
      );

      const docRef = doc(collRef);
      staffdoc = {
        ...staffdoc,
        id: docRef.id,
        authId: uid,
        role: "staff",
        deleted: false,
        ...timestampFields({ dateCreated: true, dateUpdated: true }),
      };

      batch.set(docRef, staffdoc);

      docs[index] = { ...staffdoc };
    }

    // Register admin name
    const { namesDocRef, names } = await registerNames({
      collectionName: "admins",
      names: docs.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {}),
    });
    batch.update(namesDocRef, names);

    // Bulk Create Account Document
    await batch.commit();

    return { data: docs, success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const updateStaffReq = async ({ staff }) => {
  try {
    // Check duplicate
    if (staff.name || staff.birthdate) {
      await checkDuplicate({
        collectionName: "admins",
        whereClause: where("nameBirthdate", "==", staff.nameBirthdate),
        errorMsg: {
          noun: "Staff",
        },
      });
    }

    // Update
    const batch = writeBatch(db);
    const docRef = doc(db, "admins", staff.id);
    const finalDoc = {
      ...staff,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, finalDoc);

    // Register staff name
    if (staff.name) {
      const { namesDocRef, names } = await registerNames({
        collectionName: "admins",
        names: { [staff.id]: staff.name },
      });
      batch.update(namesDocRef, names);
    }

    await batch.commit();

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const addDoctorReq = async ({ docs }) => {
  try {
    // Check email duplicate
    await checkDuplicate({
      collectionName: "admins",
      whereClause: where(
        "email",
        "in",
        docs.map((i) => i.email)
      ),
      duplicateOutputField: "email",
      errorMsg: {
        noun: "Email",
      },
    });

    // Bulk Create Auth Account
    const batch = writeBatch(db);

    for (let index = 0; index < docs.length; index++) {
      let doctordoc = { ...docs[index] };

      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(
        secondaryAuth,
        doctordoc.email,
        "12345678"
      );

      const docRef = doc(collRef);
      doctordoc = {
        ...doctordoc,
        id: docRef.id,
        authId: uid,
        role: "doctor",
        deleted: false,
        ...timestampFields({ dateCreated: true, dateUpdated: true }),
      };

      batch.set(docRef, doctordoc);

      docs[index] = { ...doctordoc };
    }

    // Register admin name
    const { namesDocRef, names } = await registerNames({
      collectionName: "admins",
      names: docs.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {}),
    });
    batch.update(namesDocRef, names);

    // Bulk Create Account Document
    await batch.commit();

    return { data: docs, success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const updateDoctorReq = async ({ doctor }) => {
  try {
    // Check duplicate
    if (doctor.name || doctor.birthdate) {
      await checkDuplicate({
        collectionName: "admins",
        whereClause: where("nameBirthdate", "==", doctor.nameBirthdate),
        errorMsg: {
          noun: "Doctor",
        },
      });
    }

    // Update
    const batch = writeBatch(db);
    const docRef = doc(db, "admins", doctor.id);
    const finalDoc = {
      ...doctor,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, finalDoc);

    // Register doctor name
    if (doctor.name) {
      const { namesDocRef, names } = await registerNames({
        collectionName: "admins",
        names: { [doctor.id]: doctor.name },
      });
      batch.update(namesDocRef, names);
    }

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
