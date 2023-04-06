import { Context } from "koa";

import service from "./service";

async function getTodos(ctx: Context) {
  ctx.body = await service.getTodos();
  ctx.status = 200;
}

async function createTodo(ctx: Context) {
  ctx.body = await service.createTodo(ctx.request.body);
  ctx.status = 201;
}

async function deleteTodo(ctx: Context) {
  const todoId = ctx.params["id"];
  await service.deleteTodo(todoId);
  ctx.status = 204;
}

async function updateTodo(ctx: Context) {
  const todoId = ctx.params["id"];
  ctx.body = await service.updateTodo(todoId, ctx.request.body);
  ctx.status = 200;
}

export default { getTodos, createTodo, updateTodo, deleteTodo };
