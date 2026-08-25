import assert = require("node:assert");
import http from "node:http";
import { test } from "node:test";

import { createApp } from "../src";

const token = "test-token";

async function request(authorization?: string) {
  const server = createApp(token).listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address() as { port: number };
  const response = await new Promise<{ status: number; body: string }>((resolve, reject) => {
    const req = http.request({ port: address.port, path: "/api/todos/", headers: authorization ? { Authorization: authorization } : {} }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode || 0, body }));
    });
    req.on("error", reject);
    req.end();
  });
  await new Promise<void>((resolve) => server.close(() => resolve()));
  return response;
}

test("rejects a request without a bearer token", async () => {
  assert.strictEqual((await request()).status, 401);
});

test("rejects an invalid bearer token", async () => {
  assert.strictEqual((await request("Bearer wrong-token")).status, 401);
});

test("allows a configured bearer token to reach the Todos API", async () => {
  const response = await request(`Bearer ${token}`);
  assert.notStrictEqual(response.status, 401);
});
