import Koa from "koa";
import bodyParser from "koa-body";

import errorHandler from "./core/middleware/error-handler";
import createRouter from "./router";

export function createApp(expectedToken = process.env.FACTORY_TODOS_AUTH_TOKEN): Koa {
  const app = new Koa();
  app.use(bodyParser());
  app.use(errorHandler);
  const router = createRouter(expectedToken);
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
}

if (require.main === module) {
  const app = createApp();
  app.listen(process.env.PORT);
  console.log(`🚀 Starting at ${process.env.PORT}`);
}
