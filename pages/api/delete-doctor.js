import { deleteUser } from "firebase/auth";
import {
  collection,
  deleteField,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db, secondaryAuth } from "../../modules/firebase/config";

const collRef = collection(db, "services");

export default async function handler(req, res) {
  try {
    // firebase tester
    // const q = query(collRef, where("deleted", "!=", true));
    // const querySnapshot = await getDocs(q);
    // const data = querySnapshot.docs.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }));
    // console.log(data);

    const ids = [
      // items to delete here
      "6DEPd2TeD1nW23FaYEVO",
    ];

    // get documents
    const q = query(collection(db, "admins"), where("id", "in", ids));
    const qs = await getDocs(q);

    const items = qs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ~ ~ ~ ~ ~ ~ ~ ~ ~ Start here
    const batch = writeBatch(db);

    // delete name on list
    batch.update(
      doc(db, "admins", "list"),
      ids.reduce((a, i) => {
        a[i] = deleteField();

        return a;
      }, {})
    );

    // delete sa admin collection
    items.forEach((d) => {
      batch.delete(doc(db, "admins", d.id));
    });

    // execute
    await batch.commit();

    res.status(200).json({
      action: "Delete doctor",
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
      })),
      uid: items.map((i) => i.authId),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
