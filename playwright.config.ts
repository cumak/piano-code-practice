import { defineConfig } from "@playwright/test";

const baseURL =
  process.env.BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === "main"
    ? process.env.BASE_DOMAIN
    : process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === "develop"
    ? process.env.DEV_DOMAIN
    : "http://localhost:3000");

console.log("Base URL is:", baseURL);

export default defineConfig({
  use: {
    baseURL,
  },
});
