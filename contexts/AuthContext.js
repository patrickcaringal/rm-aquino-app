import React, { createContext, useContext, useEffect, useState } from "react";

import { useLocalStorage } from "../hooks";
import { auth, monitorAuthState } from "../modules/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [localStorageUser, setLocalStorageUser] = useLocalStorage("user", null);
  const [user, setUser] = useState(localStorageUser);
  const [userSession, setUserSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = monitorAuthState(auth, (user) => {
      if (user) {
        setUserSession(user);
        // set user doc if not anonymous account
        // if (user?.email) {
        //   console.log("auto set");
        //   setUser({
        //     id: user.uid,
        //     // usedoc
        //   });
        // }
      } else {
        // setUser(null);
        setUserSession(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const manualSetUser = (doc) => {
    setUser(doc);
    setLocalStorageUser(doc);
  };

  const value = {
    user,
    isAdmin: ["doctor", "staff"].includes(user?.role),
    isStaff: user?.role === "staff",
    isPatient: user?.role === "patient",
    isLoggedIn: !!user && !!userSession,
    userSession,
    manualSetUser,
    // layout
    isAdminPanel: ["doctor"].includes(user?.role),
  };
  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
