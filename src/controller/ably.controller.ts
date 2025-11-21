import { Hono } from "hono";
import prisma from "../lib/prisma-client.js";
import { ErrorZod } from "../utils/error-zod.js";

const socketApp = new Hono();

socketApp.post("/auth", async (c) => {
  try {
    const body = await c.req.json();

    await prisma.user.update({
      where: { id: body.userId },
      data: {
        lastSeen: body.event === "online" ? null : new Date(),
      },
      select: { id: true },
    });

    return c.json({
      status: true,
      statusCode: 200,
      message: "Success online",
      result: null,
    });
  } catch (error) {
    return ErrorZod(error, c);
  }
});

export default socketApp;
