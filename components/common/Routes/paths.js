import lodash from "lodash";

export const PATHS = {
  // DOCTOR: {
  //   DASHBOARD: "/doctor/dashboard",
  //   SERVICES_MANAGEMENT: "/doctor/services",
  //   BRANCH_MANAGEMENT: "/doctor/branches",
  //   STAFF_MANAGEMENT: "/doctor/staffs",
  // },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    STAFF_MANAGEMENT: "/admin/staffs",
  },
  // STAFF: {
  //   DASHBOARD: "/staff/dashboard",
  //   MEMBER_APPROVAL: "/staff/member/approval",
  // },
  // PATIENT: {
  //   DASHBOARD: "/dashboard",
  //   FAMILY: "/family-members",
  // },
  PUBLIC: {
    ROOT: "/",
    PATIENT_SIGN_IN: "/signin",
    PATIENT_SIGN_UP: "/signup",
    DOCTOR_SIGN_IN: "/admin/signin",
    // STAFF_SIGN_IN: "/staff/signin",
  },
};

export const getRoleRoutes = (role) => {
  return lodash.values(PATHS[role]);
};

export const PROTECTED_ROUTES = [
  ...getRoleRoutes("ADMIN"),
  // ...getRoleRoutes("STAFF"),
  ...getRoleRoutes("PATIENT"),
];

export const LOGGED_IN_INACCESSIBLE_ROUTES = [...getRoleRoutes("PUBLIC")];
