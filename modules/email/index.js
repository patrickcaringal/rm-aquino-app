import axios from "axios";

import { getBaseApi, isDevEnv } from "../env";

export const sendEmail = async (url, payload) => {
  if (!isDevEnv) await axios.post(getBaseApi(url), payload);
  else await resolveAfter2Seconds();
};

function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 2000);
  });
}
