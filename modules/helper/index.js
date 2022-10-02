import {
  addBusinessDays,
  differenceInYears,
  format,
  getWeek,
  isWeekend,
} from "date-fns";
import { Timestamp } from "firebase/firestore";
import lodash from "lodash";

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

export const convertToDate = (timestamp) => {
  if (typeof timestamp === "string") return new Date(timestamp);

  if ("seconds" in timestamp && "nanoseconds" in timestamp) {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  } else {
    return new Date(timestamp);
  }
};

export const getDayOfWeek = (day = 0, today = new Date()) => {
  const first = today.getDate() - today.getDay() + 1;
  return new Date(today.setDate(first + day));
};

export const getNearestBusinessDay = (date = new Date()) => {
  const businessDay = isWeekend(date) ? addBusinessDays(date, 1) : date;
  return formatTimeStamp(businessDay);
};

// export const today = formatTimeStamp(new Date());
export const today = {
  dateStr: formatTimeStamp(new Date()),
  dayOfWeek: format(new Date(), "i"),
  weekNo: getWeek(new Date()),
};

export const days = {
  businessDays: [1, 2, 3, 4, 5],
};

export const calculateAge = (birthdate) => {
  const age = differenceInYears(new Date(), new Date(birthdate));
  return age;
};

export const sortBy =
  (key, sortBy = "asc") =>
  (a, b) => {
    if (sortBy === "asc")
      return new Date(convertToDate(a[key])) - new Date(convertToDate(b[key]));

    return new Date(convertToDate(b[key])) - new Date(convertToDate(a[key]));
  };

export const getInitials = (str = "") => {
  return str.toUpperCase().charAt(0);
};

export const getFullName = ({ firstName, lastName, middleName, suffix }) => {
  let fullName = `${firstName}`;
  if (middleName) fullName = `${fullName} ${middleName}`;
  fullName = `${fullName} ${lastName}`;
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
  const id = `${fullname} ${formatTimeStamp(birthdate)}`;
  return id;
};

export const pluralize = (noun, count, suffix = "s") =>
  `${noun}${count !== 1 ? suffix : ""}`;

export const arrayStringify = (array, separator = ", ") =>
  array.join(separator);

export const compareObj = ({ latest, old, fields = [], retainFields = [] }) => {
  const a = lodash.pick(latest, fields);
  const b = lodash.pick(old, fields);

  const isEqual = lodash.isEqual(a, b);
  const diff = {
    ...lodash
      .differenceWith(lodash.toPairs(a), lodash.toPairs(b), lodash.isEqual)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    // for retainng fields like id
    ...retainFields.reduce((acc, i) => ({ ...acc, [i]: old[i] }), {}),
  };

  return {
    isEqual,
    diff,
  };
};

export const personBuiltInFields = (doc) => ({
  name: getFullName(doc),
  birthdate: formatFirebasetimeStamp(doc.birthdate),
  nameBirthdate: getUniquePersonId(doc),
});

export const localUpdateDocs = ({
  updatedDoc,
  oldDocs,
  additionalDiffFields,
}) => {
  const index = oldDocs.findIndex((i) => i.id === updatedDoc.id);
  const oldDoc = oldDocs[index];

  const { diff } = compareObj({
    latest: updatedDoc,
    old: oldDoc,
    fields: Object.keys(oldDoc),
    retainFields: ["id"],
  });

  const updates = {
    ...diff,
    ...(!!additionalDiffFields && additionalDiffFields(diff)),
  };

  oldDocs[index] = {
    ...oldDocs[index],
    ...updates,
  };

  return {
    latestDocs: oldDocs,
    updates,
  };
};
