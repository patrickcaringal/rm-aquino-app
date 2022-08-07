import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import lodash from "lodash";

import { formatTimeStamp, getFullName, pluralize } from "../helper";
import { getErrorMsg } from "./auth";
import { auth, db, secondaryAuth, timestampFields } from "./config";

const collRef = collection(db, "admins");

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
        )}. ${duplicates.join(", ")}`
      );
    }

    // Check fullname duplicate
    q = query(
      collRef,
      where(
        "name",
        "in",
        staffs.map((i) => getFullName(i))
      )
    );
    querySnapshot = await getDocs(q);

    isDuplicate = querySnapshot.docs.length !== 0;
    if (isDuplicate) {
      const duplicates = querySnapshot.docs.map((i) => i.data().name);
      throw new Error(
        `Duplicate ${pluralize("Staff", duplicates.length)}. ${duplicates.join(
          ", "
        )}`
      );
    }

    const batch = writeBatch(db);

    // Bulk Create Auth Account
    for (let index = 0; index < staffs.length; index++) {
      const staffdoc = { ...staffs[index] };
      const { birthdate, email } = staffdoc;

      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        "12345678"
      );

      staffdoc = {
        ...staffdoc,
        id: uid,
        name: getFullName(staffdoc),
        birthdate: Timestamp.fromDate(new Date(birthdate)),
        // formatDate(birthdate)
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
