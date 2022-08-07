import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Timestamp, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { isDevEnv } from "../../modules/env";

const firebaseConfig = isDevEnv
  ? {
      apiKey: "AIzaSyBtmAtMHRtt1UY89Pkgmk34HcxO5URoGP0",
      authDomain: "rm-aquino-app.firebaseapp.com",
      projectId: "rm-aquino-app",
      storageBucket: "rm-aquino-app.appspot.com",
      messagingSenderId: "430511802190",
      appId: "1:430511802190:web:adad0da3d6459c9ec4401f",
    }
  : {
      apiKey: "AIzaSyCGva6wQ09KdB2cC4ysF_X-MGQiCK37Kxs",
      authDomain: "rm-aquino-medical-clinic.firebaseapp.com",
      projectId: "rm-aquino-medical-clinic",
      storageBucket: "rm-aquino-medical-clinic.appspot.com",
      messagingSenderId: "18450122125",
      appId: "1:18450122125:web:76122b654ee3a3e62e69c4",
    };

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
