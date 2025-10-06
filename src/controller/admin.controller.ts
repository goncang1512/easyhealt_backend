import { Hono } from "hono";
import prisma from "../lib/prisma-client.js";

const adminApp = new Hono();

adminApp.delete("/:user_id", async (c) => {
  const user_id = c.req.param("user_id");

  try {
    const result = await prisma.admin.delete({
      where: {
        userId: user_id,
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success delete admin",
        result: result,
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        status: false,
        statusCode: 500,
        message: "Internal Server Error",
        result: null,
      },
      500
    );
  }
});

export default adminApp;
