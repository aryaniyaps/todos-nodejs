import Router from "@koa/router";

import handlers from "./handlers";

const router = new Router({
  prefix: "/api",
});

router.get("/todos", handlers.getTodos);
router.delete("/todos/:id", handlers.deleteTodo);
router.post("/todos", handlers.createTodo);
router.patch("/todos/:id", handlers.updateTodo);

export default router;
