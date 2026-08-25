import { Context, Next } from "koa";

const unauthorized = (ctx: Context) => {
  ctx.status = 401;
  ctx.body = { message: "Unauthorized" };
};

async function authentication(ctx: Context, next: Next) {
  const configuredToken = process.env.TODOS_API_TOKEN;
  const authorization = ctx.get("Authorization");
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!configuredToken || !match || match[1] !== configuredToken) {
    unauthorized(ctx);
    return;
  }

  await next();
}

export default authentication;
