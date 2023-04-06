import Router from "@koa/router";

import controller from "./controller";

const router = new Router({
  prefix: "/todos",
});

router.get("/", controller.getTodos);
router.delete("/:id", controller.deleteTodo);
router.post("/", controller.createTodo);
router.patch("/:id", controller.updateTodo);

export default router;
