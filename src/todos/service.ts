import { object, string } from "yup";

import repo from "./repo";

// schema definitions.
const todoSchema = object({
  content: string().required().max(250),
});

// service methods.
async function getTodos() {
  return await repo.fetchTodos();
}

async function createTodo(data: { content: string }) {
  const result = await todoSchema.validate(data);
  return await repo.insertTodo(result);
}

async function deleteTodo(todoId: string) {
  return await repo.deleteTodo(todoId);
}

async function updateTodo(todoId: string, data: { content: string }) {
  const result = await todoSchema.validate(data);
  return await repo.updateTodo(todoId, result);
}

export default { getTodos, createTodo, updateTodo, deleteTodo };
