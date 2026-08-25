import Router from "@koa/router";

import { createTodosRouter } from "./todos/router";

export function createRouter(expectedToken: string | undefined): Router {
  const router = new Router({ prefix: "/api" });
  const todosRouter = createTodosRouter(expectedToken);
  router.use(todosRouter.routes(), todosRouter.allowedMethods());
  return router;
}

export default createRouter;
