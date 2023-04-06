import Router from "@koa/router";

import todosRouter from "./todos/router";

const router = new Router({
  prefix: "/api",
});

router.use(todosRouter.routes(), todosRouter.allowedMethods());

export default router;
