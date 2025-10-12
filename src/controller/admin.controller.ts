import { Hono } from "hono";
import prisma from "../lib/prisma-client.js";
import z from "zod";
import { ErrorZod } from "../utils/error-zod.js";
import adminService from "../services/admin.service.js";

const adminApp = new Hono();

adminApp.delete("/:user_id", async (c) => {
  const user_id = c.req.param("user_id");

  try {
    const parse = z
      .object({
        userId: z.string().min(31, "User ID wajib di isi"),
      })
      .parse({ userId: user_id });

    const result = await prisma.admin.delete({
      where: {
        userId: parse.userId,
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
    return ErrorZod(error, c);
  }
});

adminApp.get("/stats-today/:hospital_id", async (c) => {
  const hospitalId = c.req.param("hospital_id");

  try {
    const parse = z
      .object({
        hospitalId: z.string().min(31, "Hospital ID wajib di isi"),
      })
      .parse({ hospitalId });

    const result = await adminService.getStatsToday(parse.hospitalId);

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get stats dashboard",
        result: result,
      },
      200
    );
  } catch (error) {
    return ErrorZod(error, c);
  }
});

export default adminApp;
