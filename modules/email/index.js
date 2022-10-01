import axios from "axios";

import { getBaseApi } from "../env";

export const sendEmail = async (url, payload) => {
  await axios.post(getBaseApi(url), payload);
};
