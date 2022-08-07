export const isDevEnv = process.env.NEXT_PUBLIC_ENV === "dev";
export const isMockDataEnabled =
  isDevEnv && process.env.NEXT_PUBLIC_MOCK_DATA === "true";
