import db from "../core/database";
import { ResourceNotFound } from "../core/errors";

async function fetchTodos() {
  return await db.todo.findMany();
}

async function fetchTodo(id: string) {
  return await db.todo.findUnique({
    where: { id },
  });
}

async function insertTodo(data: { content: string }) {
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
  const existingTodo = await fetchTodo(id);
  if (!existingTodo) {
    throw new ResourceNotFound({
      message: `Could not find todo with ID ${id}`,
    });
  }

  return await db.todo.update({ where: { id }, data });
}

export default { fetchTodos, insertTodo, updateTodo, deleteTodo };
