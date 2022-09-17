export const isDevEnv = process.env.NEXT_PUBLIC_ENV === "dev";
export const isMockDataEnabled =
  isDevEnv && process.env.NEXT_PUBLIC_MOCK_DATA === "true";

const baseAPI = isDevEnv
  ? "http://localhost:3007/api"
  : "https://rm-aquino-app-be.onrender.com/api";

export const getBaseApi = (path) => {
  return `${baseAPI}${path}`;
};
