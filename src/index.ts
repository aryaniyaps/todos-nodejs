import Koa from "koa";
import bodyParser from "koa-body";

import router from "./router";
import errorHandler from "./core/middleware/error-handler";

function createApp(): Koa {
  const app = new Koa();
  addMiddleware(app);
  addRoutes(app);
  return app;
}

function addMiddleware(app: Koa) {
  app.use(bodyParser());
  app.use(errorHandler);
}

function addRoutes(app: Koa) {
  app.use(router.routes());
  app.use(router.allowedMethods());
}

const app = createApp();
app.listen(process.env.PORT);
console.log(`🚀 Starting at ${process.env.PORT}`);
