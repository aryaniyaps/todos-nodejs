import Koa from "koa";
import bodyParser from "koa-body";

import router from "./router";
import errorHandler from "./core/middleware/error-handler";
import authentication from "./core/middleware/authentication";

export function createApp(): Koa {
  const app = new Koa();
  addMiddleware(app);
  addRoutes(app);
  return app;
}

function addMiddleware(app: Koa) {
  app.use(bodyParser());
  app.use(errorHandler);
  app.use(authentication);
}

function addRoutes(app: Koa) {
  app.use(router.routes());
  app.use(router.allowedMethods());
}

if (require.main === module) {
  const app = createApp();
  app.listen(process.env.PORT);
  console.log(`🚀 Starting at ${process.env.PORT}`);
}
