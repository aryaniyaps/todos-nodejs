import assert = require("node:assert");
import http = require("node:http");
import { test } from "node:test";

const configuredToken = "test-token";

function request(
  app: ReturnType<typeof import("../src/index").createApp>,
  authorization?: string,
  path = "/api/todos",
  method = "GET",
): Promise<{ statusCode?: number; body: unknown }> {
  const server = http.createServer(app.callback());
  return new Promise((resolve, reject) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address() as { port: number };
      const client = http.request({
        host: "127.0.0.1",
        port: address.port,
        path,
        method,
        headers: authorization ? { Authorization: authorization } : undefined,
      }, (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => {
          const rawBody = Buffer.concat(chunks).toString();
          const body = rawBody ? JSON.parse(rawBody) : undefined;
          server.close((error) => error ? reject(error) : resolve({ statusCode: response.statusCode, body }));
        });
      });
      client.on("error", reject);
      client.end();
    });
  });
}

test("authentication rejects a missing bearer token", async () => {
  const response = await request(require("../src/index").createApp(configuredToken));
  assert.strictEqual(response.statusCode, 401);
});

test("authentication rejects an invalid bearer token", async () => {
  const response = await request(require("../src/index").createApp(configuredToken), "Bearer wrong-token");
  assert.strictEqual(response.statusCode, 401);
});

test("authentication protects read and write routes", async () => {
  const app = require("../src/index").createApp(configuredToken);
  const read = await request(app);
  const write = await request(app, undefined, "/api/todos", "POST");
  assert.strictEqual(read.statusCode, 401);
  assert.strictEqual(write.statusCode, 401);
});

test("authentication preserves the Todos API for a valid bearer token", async () => {
  const response = await request(
    require("../src/index").createApp(configuredToken),
    "Bearer test-token",
    "/api/todos",
    "POST",
  );
  assert.strictEqual(response.statusCode, 400);
  assert.deepStrictEqual(response.body, { message: "Validation error", errors: ["content is a required field"] });
});

test("authentication configuration is isolated between app instances", async () => {
  const first = require("../src/index").createApp("first-token");
  const second = require("../src/index").createApp("second-token");
  const responses = await Promise.all([
    request(first, "Bearer first-token", "/api/todos", "POST"),
    request(second, "Bearer second-token", "/api/todos", "POST"),
    request(first, "Bearer second-token", "/api/todos", "POST"),
    request(second, "Bearer first-token", "/api/todos", "POST"),
  ]);
  assert.deepStrictEqual(responses.map((response) => response.statusCode), [400, 400, 401, 401]);
});
