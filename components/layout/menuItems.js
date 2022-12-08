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
          text: "My Appointments",
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
          text: "Appointment",
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
          text: "Diagnosis",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.DIAGNOSIS),
        },
        {
          text: "Patient Records",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.PATIENT_MANAGEMENT),
        },
        {
          text: "Appointments",
          icon: null,
          menuItems: [
            {
              text: "All Appointments",
              onClick: () => router.push(PATHS.ADMIN.APPOINTMENT_CALENDAR),
            },
            {
              text: "My Appointments",
              onClick: () =>
                router.push({
                  // MY_APPOINTMENT_APPROVED
                  pathname: PATHS.ADMIN.MY_APPOINTMENT_CALENDAR,
                  query: { id },
                }),
            },
          ],
        },
        {
          text: "Reports",
          icon: null,
          menuItems: [
            {
              text: "Appointments per day",
              onClick: () => router.push(PATHS.ADMIN.REPORTS_APPOINTMENTS),
            },
            {
              text: "Patients per date range",
              onClick: () => router.push(PATHS.ADMIN.REPORTS_PATIENTS),
            },
          ],
        },
        {
          text: "Referral",
          icon: null,
          menuItems: [
            {
              text: "Affiliates",
              onClick: () => router.push(PATHS.ADMIN.AFFILIATES_MANAGEMENT),
            },
            {
              text: "Referr Patient",
              onClick: () => router.push(PATHS.ADMIN.REFERRAL),
            },
          ],
        },
      ];

    case "doctor":
      return [
        {
          text: "Patient Records",
          icon: null,
          onClick: () => router.push(PATHS.ADMIN.PATIENT_MANAGEMENT),
        },
        {
          text: "My Schedule",
          icon: null,
          onClick: () =>
            router.push({
              // MY_APPOINTMENT_APPROVED
              pathname: PATHS.ADMIN.DOCTORS_SCHEDULE,
              query: { id },
            }),
        },
        {
          text: "My Appointments",
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
