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
    PROFILE: "/admin/profile",
    STAFF_MANAGEMENT: "/admin/staffs",
    SERVICES_MANAGEMENT: "/admin/services",
    SERVICES_RESTORE: "/admin/services/restore",
    DOCTORS_MANAGEMENT: "/admin/doctors",
    DOCTORS_SCHEDULE: "/admin/doctors/[id]/schedule",
    DOCTORS_RESTORE: "/admin/doctors/restore",
    PATIENT_MANAGEMENT: "/admin/patients",
    PATIENT_APPROVAL: "/admin/patients/approval",
    // DOCTOR_SCHEDULE_CURRENT_WEEK: "/admin/doctor-schedule/current-week",
    // DOCTOR_SCHEDULE_NEXT_WEEK: "/admin/doctor-schedule/next-week",
    // APPOINTMENT_MANAGEMENT: "/admin/appointments",
    // APPOINTMENT_APPROVED: "/admin/appointments/approved",
    APPOINTMENT_CALENDAR: "/admin/appointments/calendar",
    APPOINTMENT_MANAGEMENT: "/admin/appointments",
    MY_APPOINTMENT_CALENDAR: "/admin/appointments/[id]/calendar",
    MY_APPOINTMENT_APPROVED: "/admin/appointments/[id]",
    REPORTS_APPOINTMENTS: "/admin/reports/appointments",
    REPORTS_PATIENTS: "/admin/reports/patients",
    CONSULTATION: "/admin/consultation",
  },
  // STAFF: {
  //   DASHBOARD: "/staff/dashboard",
  //   MEMBER_APPROVAL: "/staff/member/approval",
  // },
  PATIENT: {
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    APPOINTMENT: "/appointment",
    MEDICAL_RECORD: "/medical-record",
    SCHEDULE_APPOINTMENT: "/schedule-appointment",
  },
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
