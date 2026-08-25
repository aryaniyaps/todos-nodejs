import Koa from "koa";
import bodyParser from "koa-body";

import router from "./router";
import errorHandler from "./core/middleware/error-handler";
import authentication from "./core/middleware/authentication";

export function createApp(configuredToken = process.env.TODOS_API_TOKEN): Koa {
  const app = new Koa();
  addMiddleware(app, configuredToken);
  addRoutes(app);
  return app;
}

function addMiddleware(app: Koa, configuredToken: string | undefined) {
  app.use(bodyParser());
  app.use(errorHandler);
  app.use(authentication(configuredToken));
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
