export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const ENV: "prod" | "beta" | "staging" = (process.env.NEXT_PUBLIC_ENV as any) || "beta";
export const EXT_ID = "";
