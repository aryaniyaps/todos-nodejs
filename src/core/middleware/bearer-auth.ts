import { Middleware } from "koa";

export function bearerAuth(expectedToken: string | undefined): Middleware {
  return async (ctx, next) => {
    const authorization = ctx.get("Authorization");
    const match = /^Bearer\s+(.+)$/i.exec(authorization);

    if (!expectedToken || !match || match[1] !== expectedToken) {
      ctx.status = 401;
      return;
    }

    await next();
  };
}
