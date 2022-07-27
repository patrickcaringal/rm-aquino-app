import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { PATHS, getRoleRoutes } from "../components/common/Routes";
import { useAuth } from "../contexts/AuthContext";

const LoggedInInaccessibleRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      if (router.pathname.includes("/admin")) {
        router.push("/admin/dashboard");
        return;
      }

      // if (router.pathname.includes("/staff")) {
      //   router.push("/staff/dashboard");
      //   return;
      // }

      router.push("/dashboard");
    }
  }, [router, isLoggedIn]);

  return <>{!isLoggedIn ? children : null}</>;
};

export default LoggedInInaccessibleRoute;
