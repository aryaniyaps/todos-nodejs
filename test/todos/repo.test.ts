import { describe, it } from "node:test";

import { faker } from "@faker-js/faker";

import db from "../../src/core/database";
import repo from "../../src/todos/repo";
import assert from "node:assert";

describe("todo repository", () => {
  it("gets all todos", async (_) => {
    await repo.getTodos();
  });

  it("gets existing todo", async (_) => {
    await repo.getTodo("");
  });

  it("creates new todo", async (_) => {
    const todo = await repo.createTodo({ content: faker.lorem.sentence(250) });
    const savedTodo = await db.todo.findFirst();
    assert.equal(savedTodo, todo);
  });

  it("updates existing todo", async (_) => {
    await repo.updateTodo("", {
      content: faker.lorem.sentence(250),
    });
  });

  it("deletes existing todo", async (_) => {
    await repo.deleteTodo("");
  });
});
