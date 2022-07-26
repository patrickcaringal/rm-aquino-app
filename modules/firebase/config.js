import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Timestamp, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const TB = process.env.TB;

const firebaseConfig = {
  apiKey: "AIzaSyBtmAtMHRtt1UY89Pkgmk34HcxO5URoGP0",
  authDomain: "rm-aquino-app.firebaseapp.com",
  projectId: "rm-aquino-app",
  storageBucket: "rm-aquino-app.appspot.com",
  messagingSenderId: "430511802190",
  appId: "1:430511802190:web:adad0da3d6459c9ec4401f",
};
// DEV
// {
//   apiKey: "AIzaSyBtmAtMHRtt1UY89Pkgmk34HcxO5URoGP0",
//   authDomain: "rm-aquino-app.firebaseapp.com",
//   projectId: "rm-aquino-app",
//   storageBucket: "rm-aquino-app.appspot.com",
//   messagingSenderId: "430511802190",
//   appId: "1:430511802190:web:adad0da3d6459c9ec4401f"
// }

// STAGING
// TODO: to setup

const app = initializeApp(firebaseConfig);
const secondaryApp = initializeApp(firebaseConfig, "Secondary");

export const db = getFirestore(app);
export const auth = getAuth(app);
export const secondaryAuth = getAuth(secondaryApp);
export const storage = getStorage();

export const timestampFields = ({
  dateCreated = false,
  dateUpdated = false,
}) => {
  return {
    ...(dateCreated && { dateCreated: Timestamp.now() }),
    ...(dateUpdated && { dateUpdated: Timestamp.now() }),
  };
};
