import { Hono } from "hono";
import { prisma } from "src/lib/prisma-client.js";
import { ErrorZod } from "src/utils/error-zod.js";

const userApp = new Hono();

userApp.get("/", (c) => {
  return c.json({
    status: true,
    message: "Success create API",
  });
});

userApp.get("/home", async (c) => {
  try {
    const docters = await prisma.docter.findMany({
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
        photoUrl: true,
        specialits: true,
        hospital: {
          select: {
            name: true,
          },
        },
      },
      take: 4,
      orderBy: {
        createdAt: "asc",
      },
    });

    const hospitals = await prisma.hospital.findMany({
      select: {
        image: true,
        name: true,
        id: true,
        address: true,
      },
      take: 5,
      orderBy: {
        createdAt: "asc",
      },
    });

    return c.json({
      status: true,
      statusCode: 200,
      message: "Success get home data hospital",
      result: {
        docters,
        hospitals,
      },
    });
  } catch (error) {
    console.log(error);
    return ErrorZod(error, c);
  }
});

export default userApp;
