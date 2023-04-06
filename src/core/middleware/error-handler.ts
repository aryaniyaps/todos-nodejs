import { Context, Next } from "koa";
import { ValidationError } from "yup";

import { ResourceNotFound } from "../errors";

async function errorHandler(ctx: Context, next: Next) {
  try {
    // try executing handler.
    await next();
  } catch (err) {
    if (err instanceof ValidationError) {
      // handle validation errors.
      ctx.status = 400;
      ctx.body = {
        message: "Validation error",
        errors: err.errors,
      };
    } else if (err instanceof ResourceNotFound) {
      // handle resource not found errors.
      ctx.status = 404;
      ctx.body = {
        message: err.message,
      };
    } else {
      // handle internal server errors.
      ctx.status = 500;
      ctx.body = { message: "Internal Server error" };
    }
  }
}

export default errorHandler;
