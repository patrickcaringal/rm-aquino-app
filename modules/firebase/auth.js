import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
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
} from "firebase/firestore";

import { auth, db, secondaryAuth, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";

export const getErrorMsg = (code) => {
  const errorMap = {
    "auth/user-not-found": "Invalid email or password",
    "auth/wrong-password": "Invalid email or password",
    "auth/email-already-in-use": "Email already in use",
    "auth/network-request-failed": "Internet Error",
  };

  return errorMap[code];
};

export const signUpReq = async ({ email, password }) => {
  try {
    await createUserWithEmailAndPassword(secondaryAuth, email, password);
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};

export const signInReq = async ({ email, password }) => {
  try {
    // NOTE: query by role before login
    // Authenticate
    const res = await signInWithEmailAndPassword(auth, email, password);

    // Get User Document
    const id = res?.user?.uid;
    const collRef = collection(db, "doctors");
    const q = query(collRef, where("accountId", "==", id));
    const querySnapshot = await getDocs(q);

    const exist = querySnapshot.docs.length === 1;
    if (!exist) throw new Error("Doctor document not found");

    const document = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    };

    return { data: document, success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const signInAnonymouslyReq = async () => {
  try {
    await signInAnonymously(auth);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
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

export const signOutAnonymouslyReq = async (session) => {
  try {
    await deleteUser(session);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getUserReq = async ({ id, type }) => {
  try {
    // Get User
    const q = doc(db, type, id);
    const querySnapshot = await getDoc(q);

    if (!querySnapshot.exists()) {
      throw new Error("Unable to get doc");
    }

    const data = querySnapshot.data();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const updateUserReq = async ({ type, updates }) => {
  try {
    // Check duplicate
    if (updates.name || updates.birthdate) {
      await checkDuplicate({
        collectionName: type,
        whereClause: where("nameBirthdate", "==", updates.nameBirthdate),
        errorMsg: {
          noun: "Profile",
        },
      });
    }

    // Update
    const batch = writeBatch(db);
    const docRef = doc(db, type, updates.id);
    const finalDoc = {
      ...updates,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, finalDoc);

    // Register updates name
    if (updates.name) {
      const { namesDocRef, names } = await registerNames({
        collectionName: type,
        names: { [updates.id]: updates.name },
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

export const changePasswordReq = async ({ oldPassword, newPassword }) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const monitorAuthState = onAuthStateChanged;
