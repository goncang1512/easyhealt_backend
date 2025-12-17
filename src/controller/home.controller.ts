import { Hono } from "hono";
import { prisma } from "../lib/prisma-client.js";
import { ErrorZod } from "../utils/error-zod.js";

const homeApp = new Hono();

homeApp.get("/user", async (c) => {
  try {
    const docters = await prisma.docter.findMany({
      where: {
        status: "verified",
      },
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
      take: 5,
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
      message: "Success get home data dari hospital",
      result: {
        docters,
        hospitals,
      },
    });
  } catch (error) {
    return ErrorZod(error, c);
  }
});

export default homeApp;
