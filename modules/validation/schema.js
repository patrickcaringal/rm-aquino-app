import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  firstName: Yup.string().max(50, "First Name too long").required("Required"),
  middleName: Yup.string().max(50, "Middle Name too long"),
  lastName: Yup.string().max(50, "Last Name too long").required("Required"),
  suffix: Yup.string().max(5, "Suffix too long"),
  birthdate: Yup.string().nullable().required("Required"),
  gender: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  contactNo: Yup.string()
    .matches(/^(09)\d{9}$/, "Invalid Contact Number")
    .required("Required"),
  // password: Yup.string()
  //   .min(8, "Must be 8 characters long")
  //   .required("Required"),
});

export const UpdateProfileSchema = Yup.object().shape({
  firstName: Yup.string().max(50, "First Name too long").required("Required"),
  middleName: Yup.string().max(50, "Middle Name too long").required("Required"),
  lastName: Yup.string().max(50, "Last Name too long").required("Required"),
  suffix: Yup.string().max(5, "Suffix too long"),
  birthdate: Yup.string().nullable().required("Required"),
  gender: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
});

export const ChangePassSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be 8 characters long")
    .required("Required"),
  newPassword: Yup.string()
    .min(8, "Password must be 8 characters long")
    .required("Required"),
  matchPassword: Yup.string()
    .min(8, "Password must be 8 characters long")
    .required("Required")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

export const VerificationCodeSchema = Yup.object().shape({
  digit1: Yup.string().required("Required"),
  digit2: Yup.string().required("Required"),
  digit3: Yup.string().required("Required"),
  digit4: Yup.string().required("Required"),
});

export const SigninSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export const DoctorSigninSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export const ForgotPassSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

export const FamilyMemberSchema = Yup.object().shape({
  familyMembers: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string()
        .max(50, "First Name too long")
        .required("Required"),
      middleName: Yup.string().max(50, "Middle Name too long"),
      lastName: Yup.string().max(50, "Last Name too long").required("Required"),
      suffix: Yup.string().max(5, "Suffix too long"),
      birthdate: Yup.string().nullable().required("Required"),
      gender: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
    })
  ),
});

export const StaffSchema = Yup.object().shape({
  staffs: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string()
        .max(50, "First Name too long")
        .required("Required"),
      middleName: Yup.string().max(50, "Middle Name too long"),
      lastName: Yup.string().max(50, "Last Name too long").required("Required"),
      suffix: Yup.string().max(5, "Suffix too long"),
      birthdate: Yup.string().nullable().required("Required"),
      gender: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
    })
  ),
});

export const DoctorSchema = Yup.object().shape({
  staffs: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string()
        .max(50, "First Name too long")
        .required("Required"),
      middleName: Yup.string().max(50, "Middle Name too long"),
      lastName: Yup.string().max(50, "Last Name too long").required("Required"),
      suffix: Yup.string().max(5, "Suffix too long"),
      birthdate: Yup.string().nullable().required("Required"),
      gender: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      services: Yup.array().min(1, "Required"),
      specialty: Yup.string()
        .max(50, "Specialty too long")
        .required("Required"),
      contactNo: Yup.string()
        .matches(/^(09)\d{9}$/, "Invalid Contact Number")
        .required("Required"),
    })
  ),
});

export const ServicesSchema = Yup.object().shape({
  services: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().max(50, "Service name too long").required("Required"),
      description: Yup.string()
        .max(250, "Description too long")
        .required("Required"),
    })
  ),
});

export const BranchesSchema = Yup.object().shape({
  branches: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().max(50, "Branch name too long").required("Required"),
      services: Yup.array().min(1, "Required"),
      capacity: Yup.number()
        .required("Required")
        .test("Is positive?", "Positive number only", (value) => value >= 0),
      address: Yup.string()
        .max(250, "Description too long")
        .required("Required"),
    })
  ),
});

export const PatientRejectSchema = Yup.object().shape({
  reason: Yup.string().max(250, "Reason too long").required("Required"),
});

export const DiagnoseSchema = Yup.object().shape({
  diagnosis: Yup.string().required("Required").max(500, "Diagnosis too long"),
});

export const ReferSchema = Yup.object().shape({
  date: Yup.string().nullable().required("Required"),
  address: Yup.string().max(250, "Address too long").required("Required"),
  content: Yup.string().required("Required"),
});

export const AffiliatesSchema = Yup.object().shape({
  affiliates: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().max(255, "Name too long").required("Required"),
      address: Yup.string().max(250, "address too long").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
    })
  ),
});

export const ReferralSchema = Yup.object().shape({
  affiliateName: Yup.string().required("Required"),
  patientName: Yup.string().required("Required"),
  serviceName: Yup.string().required("Required"),
  otherServiceName: Yup.string().when("serviceName", {
    is: (serviceName) => serviceName === "Others",
    then: Yup.string().required("Required"),
  }),
  remarks: Yup.string(),
});

export const VitalSignsSchema = Yup.object().shape({
  bodyTemperature: Yup.string().required("Required"),
  pulseRate: Yup.string().required("Required"),
  bloodPressure: Yup.string().required("Required"),
  height: Yup.string().required("Required"),
  weight: Yup.string().required("Required"),
});
