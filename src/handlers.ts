import { Context } from "koa";

import db from "./database";

async function getTodos(ctx: Context) {
  const todos = await db.todo.findMany();
  ctx.body = todos;
  ctx.status = 200;
}

async function createTodo(ctx: Context) {
  const { content } = ctx.request.body;
  const result = await db.todo.create({
    data: {
      content,
    },
  });
  ctx.body = result;
  ctx.status = 201;
}

async function deleteTodo(ctx: Context) {
  const todoId = ctx.params["id"];
  try {
    await db.todo.delete({
      where: {
        id: todoId,
      },
    });
    ctx.status = 204;
  } catch {
    ctx.body = { error: `Could not find todo with ID ${todoId}` };
    ctx.status = 404;
  }
}

async function updateTodo(ctx: Context) {
  const todoId = ctx.params["id"];
  const { content } = ctx.request.body;
  const existingTodo = await db.todo.findUnique({
    where: { id: todoId },
  });
  if (!existingTodo) {
    ctx.body = { error: `Could not find todo with ID ${todoId}` };
    ctx.status = 404;
    return;
  }

  const result = await db.todo.update({
    where: { id: todoId },
    data: { content },
  });

  ctx.body = result;
  ctx.status = 200;
}

export default { getTodos, createTodo, updateTodo, deleteTodo };
