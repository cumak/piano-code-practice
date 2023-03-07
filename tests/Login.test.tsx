/**
 * @jest-environment jsdom
 */

/**
 * 未完成
 */

import "@testing-library/jest-dom";
import "setimmediate";

import { act, cleanup, render, screen } from "@testing-library/react";
import { getPage, initTestHelpers } from "next-page-tester";

// next-page-testerを使用するために実行しておく
initTestHelpers();

afterEach(() => {
  cleanup();
});

//firebaseにログインしていない状態でmypageに移動したら、ログインページにリダイレクトされるかどうかを確認するテスト
describe("Login", () => {
  it("ユーザーがログインしていない場合、ログインページにリダイレクトする。", async () => {
    await act(async () => {
      const { page } = await getPage({
        route: "/login",
      });
      render(page);
    });
    screen.debug();
    // expect(await screen.findByText("ログイン")).toBeInTheDocument();
  });
});
