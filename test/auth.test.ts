import assert = require("node:assert");
import http = require("node:http");
import { test } from "node:test";

process.env.TODOS_API_TOKEN = "test-token";
const { createApp } = require("../src/index") as typeof import("../src/index");

function request(authorization?: string, path = "/api/todos"): Promise<http.IncomingMessage> {
  const server = http.createServer(createApp().callback());
  return new Promise((resolve, reject) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address() as { port: number };
      const requestOptions: http.RequestOptions = {
        host: "127.0.0.1",
        port: address.port,
        path,
        headers: authorization ? { Authorization: authorization } : undefined,
      };
      const client = http.get(requestOptions, (response) => {
        response.resume();
        response.on("end", () => {
          server.close((error) => (error ? reject(error) : resolve(response)));
        });
      });
      client.on("error", reject);
    });
  });
}

test("authentication rejects a missing bearer token", async () => {
  const response = await request();
  assert.strictEqual(response.statusCode, 401);
});

test("authentication rejects an invalid bearer token", async () => {
  const response = await request("Bearer wrong-token");
  assert.strictEqual(response.statusCode, 401);
});

test("authentication preserves the Todos API for a valid bearer token", async () => {
  const response = await request("Bearer test-token", "/api/todos/not-a-route");
  assert.strictEqual(response.statusCode, 405);
});
