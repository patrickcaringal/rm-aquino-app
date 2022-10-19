import { PATHS } from "../../components/common/Routes";

export const getNavbarItems = (id, role, router) => {
  switch (role) {
    case "patient":
      return [
        {
          text: "Medical Record",
          icon: null,
          onClick: () => router.push(PATHS.PATIENT.MEDICAL_RECORD),
        },
        {
          text: "Appointments",
          icon: null,
          onClick: () => router.push(PATHS.PATIENT.APPOINTMENT),
        },
        {
          text: "Schedule Appointment",
          icon: null,
          onClick: () => router.push(PATHS.PATIENT.SCHEDULE_APPOINTMENT),
        },
      ];

    case "staff":
      return [
        {
          text: "Patient Records",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.PATIENT_MANAGEMENT),
        },
        {
          text: "Patient Approval",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.PATIENT_APPROVAL),
        },
        {
          text: "Appointments",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.APPOINTMENT_MANAGEMENT),
        },

        {
          text: "Appointment Approval",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.APPOINTMENT_CALENDAR),
        },
      ];

    case "superadmin":
      return [
        {
          text: "Doctors",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.DOCTORS_MANAGEMENT),
        },
        {
          text: "Staffs",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.STAFF_MANAGEMENT),
        },
        {
          text: "Services",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.SERVICES_MANAGEMENT),
        },
        {
          text: "Patient Records",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.PATIENT_MANAGEMENT),
        },
        {
          text: "Patient Approval",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.PATIENT_APPROVAL),
        },
        // {
        //   text: "Patients",
        //   icon: null,
        //   menuItems: [
        //     {
        //       text: "Patient List",
        //       onClick: () => router.push(PATHS.ADMIN.PATIENT_MANAGEMENT),
        //     },
        //     {
        //       text: "Patient Approval",
        //       onClick: () => router.push(PATHS.ADMIN.PATIENT_APPROVAL),
        //     },
        //   ],
        // },
        {
          text: "Appointments",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.APPOINTMENT_MANAGEMENT),
        },
        // {
        //   text: "Consultation",
        //   icon: null,
        //   onClick: () => router.push(PATHS.ADMIN.CONSULTATION),
        // },
      ];

    case "doctor":
      return [
        {
          text: "Patient Records",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.PATIENT_MANAGEMENT),
        },
        {
          text: "Appointments",
          icon: null,
          onClick: () =>
            router.push({
              // MY_APPOINTMENT_APPROVED
              pathname: PATHS.ADMIN.MY_APPOINTMENT_CALENDAR,
              query: { id },
            }),
        },
        // {
        //   text: "Appointments",
        //   icon: null,
        //   menuItems: [
        //     {
        //       text: "Appointment List",
        //       onClick: () => router.push(PATHS.ADMIN.APPOINTMENT_MANAGEMENT),
        //     },
        //     {
        //       text: "Appointment Approval",
        //       onClick: () => router.push(PATHS.ADMIN.APPOINTMENT_CALENDAR),
        //     },
        //   ],
        // },
        // {
        //   text: "Consultation",
        //   icon: null,
        //   onClick: () => router.push(PATHS.ADMIN.CONSULTATION),
        // },
      ];

    default:
      return [];
  }
};
