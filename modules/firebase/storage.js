import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { v4 } from "uuid";

import { storage } from "./config";

export const uploadImageReq = async ({ file }) => {
  try {
    // upload
    const filename = v4();
    const storageRef = ref(storage, `fam-verification/${filename}`);
    const res = await uploadBytes(storageRef, file);

    // get uploaded url
    const url = await getDownloadURL(res.ref);
    return { data: url, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const deleteImageReq = async ({ url }) => {
  try {
    const storageRef = ref(storage, url);

    // Delete Image
    await deleteObject(storageRef);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

// import { getStorage, ref, deleteObject } from "firebase/storage";

// const storage = getStorage();

// // Create a reference to the file to delete
// const desertRef = ref(storage, 'images/desert.jpg');

// // Delete the file
// deleteObject(desertRef).then(() => {
//   // File deleted successfully
// }).catch((error) => {
//   // Uh-oh, an error occurred!
// });
