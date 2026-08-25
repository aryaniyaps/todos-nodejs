import Router from "@koa/router";

import { bearerAuth } from "../core/middleware/bearer-auth";
import controller from "./controller";

export function createTodosRouter(expectedToken: string | undefined): Router {
  const router = new Router({ prefix: "/todos" });
  router.use(bearerAuth(expectedToken));
  router.get("/", controller.getTodos);
  router.delete("/:id", controller.deleteTodo);
  router.post("/", controller.createTodo);
  router.patch("/:id", controller.updateTodo);
  return router;
}

export default createTodosRouter;
