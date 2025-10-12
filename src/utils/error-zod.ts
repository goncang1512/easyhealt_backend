import { ContentfulStatusCode } from "hono/utils/http-status";
import z from "zod";

let result = null;
let statusCode: ContentfulStatusCode | undefined = 200;
let message = "";

export const ErrorZod = (error: unknown, c: any) => {
  if (error instanceof z.ZodError) {
    const errorMsg = JSON.parse(error.message);
    message = errorMsg[0].message;
    statusCode = 422;

    return c.json(
      {
        status: false,
        statusCode,
        message,
        result,
      },
      statusCode
    );
  }

  return c.json(
    {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      result: null,
    },
    500
  );
};
