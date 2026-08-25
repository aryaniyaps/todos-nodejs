import { Context, Next } from "koa";

const unauthorized = (ctx: Context) => {
  ctx.status = 401;
  ctx.body = { message: "Unauthorized" };
};

export function authentication(configuredToken: string | undefined) {
  return async function authenticate(ctx: Context, next: Next) {
    const authorization = ctx.get("Authorization");
    const match = authorization.match(/^Bearer\s+(.+)$/i);

    if (!configuredToken || !match || match[1] !== configuredToken) {
      unauthorized(ctx);
      return;
    }

    await next();
  };
}

export default authentication;
