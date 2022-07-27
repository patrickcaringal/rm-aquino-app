import React, { useEffect, useMemo } from "react";

import lodash from "lodash";
import { useRouter } from "next/router";

import { PATHS, getRoleRoutes } from "../components/common/Routes";
import { useAuth } from "../contexts/AuthContext";

const adminRoutes = getRoleRoutes("ADMIN");
// const staffRoutes = getRoleRoutes("STAFF");
const patientRoutes = getRoleRoutes("PATIENT");

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isStaff, isAdmin, isPatient } = useAuth();
  const router = useRouter();

  const isRouteNotAllowed = useMemo(
    () => ({
      admin: isAdmin && isLoggedIn && !adminRoutes.includes(router.pathname),
      // staff: isStaff && isLoggedIn && !staffRoutes.includes(router.pathname),
      patient:
        isPatient && isLoggedIn && !patientRoutes.includes(router.pathname),
    }),
    [isLoggedIn, isAdmin, isPatient, router.pathname]
  );

  // Not Logged in
  useEffect(() => {
    if (!isLoggedIn) {
      if (router.pathname.includes("/admin")) {
        router.push(PATHS.PUBLIC.DOCTOR_SIGN_IN);
        return;
      }

      // if (router.pathname.includes("/staff")) {
      //   router.push(PATHS.PUBLIC.STAFF_SIGN_IN);
      //   return;
      // }

      router.push(PATHS.PUBLIC.ROOT);
    }
  }, [router, isLoggedIn]);

  // Logged in, Role Authorization
  useEffect(() => {
    // if (isRouteNotAllowed.staff) {
    //   router.push(PATHS.STAFF.DASHBOARD);
    //   return;
    // }

    if (isRouteNotAllowed.admin) {
      router.push(PATHS.ADMIN.DASHBOARD);
      return;
    }

    if (isRouteNotAllowed.patient) {
      router.push(PATHS.PATIENT.DASHBOARD);
      return;
    }
  }, [router, isRouteNotAllowed]);

  const isAllowed = !lodash.values(isRouteNotAllowed).some((i) => i);

  return <>{isLoggedIn && isAllowed ? children : null}</>;
};

export default ProtectedRoute;
