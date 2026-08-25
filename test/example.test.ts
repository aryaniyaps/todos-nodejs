import assert = require("node:assert");
import http from "node:http";
import { test } from "node:test";

import { createApp } from "../src";

const token = "test-token";

async function request(authorization?: string, body?: string) {
  const server = createApp(token).listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address() as { port: number };
  const headers: Record<string, string> = {};
  if (authorization) headers.Authorization = authorization;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    headers["Content-Length"] = String(Buffer.byteLength(body));
  }
  const response = await new Promise<{ status: number; body: string }>((resolve, reject) => {
    const req = http.request({ method: body === undefined ? "GET" : "POST", port: address.port, path: "/api/todos/", headers }, (res) => {
      let responseBody = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (responseBody += chunk));
      res.on("end", () => resolve({ status: res.statusCode || 0, body: responseBody }));
    });
    req.on("error", reject);
    req.end(body);
  });
  await new Promise<void>((resolve) => server.close(() => resolve()));
  return response;
}

test("rejects a request without a bearer token", async () => {
  assert.strictEqual((await request()).status, 401);
});

test("rejects malformed body before the body parser runs without a bearer token", async () => {
  assert.strictEqual((await request(undefined, "{not-json")).status, 401);
});

test("rejects an invalid bearer token", async () => {
  assert.strictEqual((await request("Bearer wrong-token")).status, 401);
});

test("allows a configured bearer token to reach the Todos API", async () => {
  const response = await request(`Bearer ${token}`, "{}");
  assert.strictEqual(response.status, 400);
  assert.match(response.body, /Validation error/);
});
