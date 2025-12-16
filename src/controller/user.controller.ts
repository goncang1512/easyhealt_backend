import { Hono } from "hono";
import { prisma } from "../lib/prisma-client.js";
import { ErrorZod } from "../utils/error-zod.js";

const userApp = new Hono();

userApp.get("/", (c) => {
  return c.json({
    status: true,
    message: "Success create API",
  });
});

userApp.get("/:user_id", async (c) => {
  try {
    const result = await prisma.user.findFirst({
      where: {
        id: c.req.param("user_id") as string,
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    return c.json({
      status: true,
      statusCode: 200,
      message: "Success get home data hospital",
      result,
    });
  } catch (error) {
    return ErrorZod(error, c);
  }
});

userApp.put("/update/:user_id", async (c) => {
  try {
    const { username, email, phone, address } = await c.req.json();

    const result = await prisma.user.update({
      where: {
        id: c.req.param("user_id"),
      },
      data: {
        name: username,
        email: email,
        phone: phone,
        adress: address,
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success update user",
        result,
      },
      200
    );
  } catch (error) {
    return ErrorZod(error, c);
  }
});

export default userApp;
