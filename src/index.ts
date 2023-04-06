import Koa from "koa";
import bodyParser from "koa-body";

import router from "./router";

function createApp(): Koa {
  const app = new Koa();
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
}

const app = createApp();
app.listen(process.env.PORT);
console.log(`🚀 Starting at ${process.env.PORT}`);
