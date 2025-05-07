import { test, expect } from "@playwright/test";

test("ログインページに「ログイン」というボタンが表示されている", async ({ page }) => {
  // ログインページに移動
  await page.goto("/login");

  // 「ログイン」ボタンが表示されていることを確認
  const loginButton = page.locator('button[aria-label="ログイン"]');
  await expect(loginButton).toBeVisible();
});

test("/mypageにアクセスしたら/loginにリダイレクトされる", async ({ page }) => {
  // /mypageに移動
  await page.goto("/mypage");

  // 現在のURLが/loginであることを確認
  await expect(page).toHaveURL("/login");
});
