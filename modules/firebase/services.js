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

import { associationMessage } from "../../components/common";
import { sortBy } from "../helper";
import { getErrorMsg } from "./auth";
import { db, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";

const collRef = collection(db, "services");

export const getServicesReq = async () => {
  try {
    const q = query(collRef, where("deleted", "!=", true));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(sortBy("dateCreated"));

    const map = data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {});

    return { data, map, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getServiceReq = async ({ id }) => {
  try {
    // Get Patient
    const q = doc(db, "services", id);
    const querySnapshot = await getDoc(q);

    if (!querySnapshot.exists()) {
      throw new Error("Unable to get Services doc");
    }

    const data = querySnapshot.data();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getDeletedServicesReq = async () => {
  try {
    const q = query(collRef, where("deleted", "==", true));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const map = data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {});

    return { data, map, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addServiceReq = async ({ docs }) => {
  try {
    // Check duplicate
    await checkDuplicate({
      collectionName: "services",
      whereClause: where(
        "name",
        "in",
        docs.map((i) => i.name)
      ),
      errorMsg: {
        noun: "Service",
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
      batch.set(doc(db, "services", id), mappedDoc);

      return mappedDoc;
    });

    // Register Patient name
    const { namesDocRef, names } = await registerNames({
      collectionName: "services",
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

export const updateServiceReq = async ({ service }) => {
  try {
    // Check duplicate
    if (service.name) {
      await checkDuplicate({
        collectionName: "services",
        whereClause: where("name", "==", service.name),
        errorMsg: {
          noun: "Service",
        },
      });
    }

    const batch = writeBatch(db);

    // Update
    const docRef = doc(db, "services", service.id);
    const finalDoc = {
      ...service,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, finalDoc);

    // Register service name
    if (service.name) {
      const { namesDocRef, names } = await registerNames({
        collectionName: "services",
        names: { [service.id]: service.name },
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

export const deleteServiceReq = async ({ service }) => {
  try {
    // TODO: convert to cheeck doctor services
    // // Check Branches associated
    // await checkDuplicate({
    //   collectionName: "branches",
    //   whereClause: where("servicesId", "array-contains", service.id),
    //   customErrorMsg: associationMessage({
    //     verb: "delete",
    //     item: service.name,
    //     noun: `some Branches`,
    //   }),
    // });

    // Update to deleted status
    const docRef = doc(db, "services", service.id);
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

export const restoreServiceReq = async ({ docs }) => {
  try {
    // Bulk Update Document
    const batch = writeBatch(db);

    docs.forEach((d) => {
      const updatedFields = {
        deleted: false,
      };
      batch.update(doc(db, "services", d.id), updatedFields);
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
