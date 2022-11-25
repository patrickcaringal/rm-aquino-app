import axios from "axios";

import { getBaseApi } from "../env";

export const sendEmail = async (url, payload) => {
  // await axios.post(getBaseApi(url), payload);
  await resolveAfter2Seconds();
};

function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 2000);
  });
}
