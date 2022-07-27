import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

import { formatDate } from "../helper";
import { getErrorMsg } from "./auth";
import { auth, db } from "./config";

const collRef = collection(db, "admins");

export const signInAdminReq = async ({ email, password }) => {
  try {
    // Authenticate
    const res = await signInWithEmailAndPassword(auth, email, password);

    // Get Document
    const id = res?.user?.uid;
    const q = query(collRef, where("id", "==", id));
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
