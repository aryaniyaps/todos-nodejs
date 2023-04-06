import db from "../core/database";
import { ResourceNotFound } from "../core/errors";

async function getTodos() {
  return await db.todo.findMany();
}

async function getTodo(id: string) {
  return await db.todo.findUnique({
    where: { id },
  });
}

async function createTodo(data: { content: string }) {
  return await db.todo.create({ data });
}

async function deleteTodo(id: string) {
  try {
    await db.todo.delete({ where: { id } });
  } catch {
    throw new ResourceNotFound({
      message: `Could not find todo with ID ${id}`,
    });
  }
}

async function updateTodo(id: string, data: { content: string }) {
  const existingTodo = await getTodo(id);
  if (!existingTodo) {
    throw new ResourceNotFound({
      message: `Could not find todo with ID ${id}`,
    });
  }

  return await db.todo.update({ where: { id }, data });
}

export default { getTodos, getTodo, createTodo, updateTodo, deleteTodo };
