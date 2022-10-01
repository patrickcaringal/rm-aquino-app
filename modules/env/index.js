export const isDevEnv = process.env.NEXT_PUBLIC_ENV === "dev";
export const isMockDataEnabled =
  isDevEnv && process.env.NEXT_PUBLIC_MOCK_DATA === "true";

const baseURL = isDevEnv
  ? "http://localhost:3006/"
  : "https://rm-aquino-app.vercel.app/";

const baseAPI = isDevEnv
  ? "http://localhost:3007/api/rm-aquino"
  : "https://rm-aquino-app-be.onrender.com/api/rm-aquino";

export const getBaseApi = (path) => {
  return `${baseAPI}${path}`;
};

export const getBaseUrl = (path) => {
  return `${baseURL}${path}`;
};
