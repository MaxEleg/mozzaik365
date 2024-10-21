import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";

export const server = setupServer(...handlers);

server.events.on("request:match", ({ request }) => {
  console.log("MSW matched ✅ : ", request.method, request.url);
});

server.events.on("request:unhandled", ({ request }) => {
  console.log("MSW unhandled ❗: ", request.method, request.url);
});

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());
