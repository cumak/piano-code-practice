import { defineConfig } from "@playwright/test";

const branch =
  process.env.GITHUB_BASE_REF || // PRのベースブランチ
  process.env.GITHUB_REF_NAME; // 通常のpush時などのブランチ名
const baseURL =
  process.env.BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : branch === "main"
    ? process.env.BASE_DOMAIN
    : branch === "develop"
    ? process.env.DEV_DOMAIN
    : "http://localhost:3000");

console.log("branch", branch);
console.log("baseURL", baseURL);

export default defineConfig({
  use: {
    baseURL,
  },
});
