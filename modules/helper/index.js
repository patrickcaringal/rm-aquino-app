import { differenceInYears, format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export const formatDate = (date, dateformat = "yyyy-MM-dd") => {
  return format(new Date(date), dateformat);
};

export const formatTimeStamp = (timestamp, dateformat = "yyyy-MM-dd") => {
  if (typeof timestamp === "string")
    return format(new Date(timestamp), dateformat);

  if ("seconds" in timestamp && "nanoseconds" in timestamp) {
    return format(
      new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000),
      dateformat
    );
  } else {
    return format(new Date(timestamp), dateformat);
  }
};

export const formatFirebasetimeStamp = (timestamp) => {
  return Timestamp.fromDate(new Date(timestamp));
};

export const calculateAge = (birthdate) => {
  const age = differenceInYears(new Date(), new Date(birthdate));
  return age;
};

export const getInitials = (str = "") => {
  return str.toUpperCase().charAt(0);
};

export const getFullName = ({ firstName, lastName, middleName, suffix }) => {
  let fullName = `${firstName} ${middleName} ${lastName}`;
  if (suffix) fullName = `${fullName} ${suffix}`;
  return fullName;
};

export const getUniquePersonId = ({
  firstName,
  lastName,
  middleName,
  suffix,
  birthdate,
}) => {
  const fullname = getFullName({ firstName, middleName, lastName, suffix });
  const id = `${fullname} ${formatDate(birthdate)}`;
  return id;
};

export const pluralize = (noun, count, suffix = "s") =>
  `${noun}${count !== 1 ? suffix : ""}`;

export const arrayStringify = (array, separator = ", ") =>
  array.join(separator);
