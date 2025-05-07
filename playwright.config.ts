import { defineConfig } from "@playwright/test";

const branch = process.env.GITHUB_REF_NAME;
const baseURL =
  process.env.BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : branch === "main"
    ? process.env.BASE_DOMAIN
    : branch === "develop"
    ? process.env.DEV_DOMAIN
    : "http://localhost:3000");

export default defineConfig({
  use: {
    baseURL,
  },
});
