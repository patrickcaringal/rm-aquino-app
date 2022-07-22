import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  zxc,
} from "firebase/firestore";

import { formatDate } from "../helper";
import { getErrorMsg } from "./auth";
import { auth, db, secondaryAuth } from "./config";

const collRef = collection(db, "staffs");

export const signInStaffReq = async ({ email, password }) => {
  try {
    // Authenticate
    const res = await signInWithEmailAndPassword(auth, email, password);

    // Get User Document
    const id = res?.user?.uid;
    const collRef = collection(db, "staffs");
    const q = query(collRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);

    const exist = querySnapshot.docs.length === 1;
    if (!exist) throw new Error("Staff document not found");

    const document = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    };

    return { data: document, success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const getStaffsReq = async ({ branch }) => {
  try {
    // TODO: adjust when get branch needed
    // const q = query(collRef, where("branch", "==", branch));
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

export const addStaffReq = async ({ staffs }) => {
  try {
    // Bulk Create Auth Account
    for (let index = 0; index < staffs.length; index++) {
      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(
        secondaryAuth,
        staffs[index].email,
        "12345678"
      );

      staffs[index] = { ...staffs[index], id: uid };
    }

    // Bulk Create Account Document
    const batch = writeBatch(db);

    staffs.forEach((staffdoc) => {
      const { birthdate } = staffdoc;
      const docRef = doc(collRef);

      const mappedDoc = {
        ...staffdoc,
        birthdate: formatDate(birthdate),
        role: "staff",
      };

      batch.set(doc(db, "staffs", docRef.id), mappedDoc);
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
