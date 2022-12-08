import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { associationMessage } from "../../components/common";
import { sortBy } from "../helper";
import { getErrorMsg } from "./auth";
import { db, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";

const collectionName = "diagnosis";
const collRef = collection(db, collectionName);

export const getDiagnosisReq = async () => {
  try {
    const q = query(collRef, where("deleted", "!=", true));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs
      .map((doc) => ({ ...doc.data() }))
      .sort(sortBy("dateCreated"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addDiagnosisReq = async ({ docs }) => {
  try {
    // Check duplicate
    await checkDuplicate({
      collectionName,
      whereClause: where(
        "name",
        "in",
        docs.map((i) => i.name)
      ),
      errorMsg: {
        noun: "Diagnosis",
      },
    });

    // Bulk Create Document
    const batch = writeBatch(db);

    const data = docs.map((d) => {
      const docRef = doc(collRef);
      const id = docRef.id;
      const mappedDoc = {
        id,
        ...d,
        deleted: false,
        ...timestampFields({ dateCreated: true, dateUpdated: true }),
      };
      batch.set(doc(db, collectionName, id), mappedDoc);

      return mappedDoc;
    });

    // Register name
    const { namesDocRef, names } = await registerNames({
      collectionName,
      names: data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {}),
    });
    batch.update(namesDocRef, names);

    await batch.commit();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const updateDiagnosisReq = async ({ document }) => {
  try {
    // Check duplicate
    if (document.name) {
      await checkDuplicate({
        collectionName,
        whereClause: where("name", "==", document.name),
        errorMsg: {
          noun: "Diagnosis",
        },
      });
    }

    const batch = writeBatch(db);

    // Update
    const docRef = doc(db, collectionName, document.id);
    const finalDoc = {
      ...document,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, finalDoc);

    // Register name
    if (document.name) {
      const { namesDocRef, names } = await registerNames({
        collectionName,
        names: { [document.id]: document.name },
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

export const deleteDiagnosisReq = async ({ document }) => {
  try {
    // Update to deleted status
    const docRef = doc(db, collectionName, document.id);
    const finalDoc = {
      deleted: true,
      ...timestampFields({ dateUpdated: true }),
    };
    await updateDoc(docRef, finalDoc);

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

// export const getDeletedServicesReq = async () => {
//   try {
//     const q = query(collRef, where("deleted", "==", true));
//     const querySnapshot = await getDocs(q);
//     const data = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     const map = data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {});

//     return { data, map, success: true };
//   } catch (error) {
//     console.log(error);
//     return { error: error.message };
//   }
// };

// export const addServiceReq = async ({ docs }) => {
//   try {
//     // Check duplicate
//     await checkDuplicate({
//       collectionName: "services",
//       whereClause: where(
//         "name",
//         "in",
//         docs.map((i) => i.name)
//       ),
//       errorMsg: {
//         noun: "Service",
//       },
//     });

//     // Bulk Create Document
//     const batch = writeBatch(db);

//     const data = docs.map((d) => {
//       const docRef = doc(collRef);
//       const id = docRef.id;
//       const mappedDoc = {
//         id,
//         ...d,
//         deleted: false,
//         ...timestampFields({ dateCreated: true, dateUpdated: true }),
//       };
//       batch.set(doc(db, "services", id), mappedDoc);

//       return mappedDoc;
//     });

//     // Register Patient name
//     const { namesDocRef, names } = await registerNames({
//       collectionName: "services",
//       names: data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {}),
//     });
//     batch.update(namesDocRef, names);

//     await batch.commit();

//     return { data, success: true };
//   } catch (error) {
//     console.log(error);
//     const errMsg = getErrorMsg(error.code);
//     return { error: errMsg || error.message };
//   }
// };

// export const restoreServiceReq = async ({ docs }) => {
//   try {
//     // Bulk Update Document
//     const batch = writeBatch(db);

//     docs.forEach((d) => {
//       const updatedFields = {
//         deleted: false,
//       };
//       batch.update(doc(db, "services", d.id), updatedFields);
//     });

//     await batch.commit();

//     return { success: true };
//   } catch (error) {
//     const errMsg = getErrorMsg(error.code);
//     return { error: errMsg || error.message };
//   }
// };
