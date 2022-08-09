import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";

import { duplicateMessage } from "../../components/common";
import { arrayStringify, pluralize } from "../helper";
import { db } from "./config";

export const checkDuplicate = async ({
  collectionName,
  whereClause,
  duplicateOutputField = "name",
  customErrorMsg,
  errorMsg,
}) => {
  const collRef = collection(db, collectionName);
  const q = query(collRef, whereClause);
  const querySnapshot = await getDocs(q);

  const duplicates = querySnapshot.docs.map(
    (i) => i.data()?.[duplicateOutputField]
  );
  if (duplicates.length) {
    const error =
      customErrorMsg ||
      duplicateMessage({
        noun: pluralize(errorMsg.noun, duplicates.length, errorMsg.suffix),
        item: arrayStringify(duplicates),
      });

    throw new Error(error);
  }
};

export const registerNames = async ({
  collectionName,
  names,
  update = false,
}) => {
  const docRef = doc(db, collectionName, "list");
  if (update) await updateDoc(docRef, { ...names });

  return { namesDocRef: docRef, names };
};
