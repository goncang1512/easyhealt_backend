import prisma from "../lib/prisma-client.js";
import type { Prisma } from "@prisma/client";
import { generateId } from "better-auth";
import { Hono } from "hono";

const hospitalApp = new Hono();

hospitalApp.post("/", async (c) => {
  const body = await c.req.json();
  try {
    const result = await prisma.hospital.create({
      data: {
        id: generateId(32),
        name: body.name,
        address: body.address,
        email: body.email,
        numberPhone: body.numberPhone,
        open: body.open ?? "24 jam",
        room: Number(body.room),
        userId: body.admin_id,
        admin: {
          create: {
            id: generateId(32),
            userId: body.admin_id,
          },
        },
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success register hospital",
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

hospitalApp.get("/", async (c) => {
  const keyword = c.req.query("keyword");

  const where: Prisma.HospitalWhereInput = keyword
    ? {
        OR: [
          {
            name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            address: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const results = await prisma.hospital.findMany({
    where,
    select: {
      id: true,
      name: true,
      address: true,
      image: true,
    },
  });

  return c.json({
    status: true,
    statusCode: 200,
    message: "Success find hospital",
    result: results,
  });
});

hospitalApp.delete("/:hospital_id", async (c) => {
  const hospitalId = c.req.param("hospital_id");

  const result = await prisma.hospital.delete({
    where: {
      id: hospitalId,
    },
  });

  return c.json({
    status: true,
    statusCode: 200,
    message: "Success delete hospital",
    result: result,
  });
});

hospitalApp.put("/edit/:hospital_id", async (c) => {
  const body = await c.req.json();
  const hospitalId = c.req.param("hospital_id");

  try {
    const result = await prisma.hospital.update({
      where: {
        id: hospitalId,
      },
      data: {
        name: body.name,
        address: body.address,
        email: body.email,
        numberPhone: body.numberPhone,
        open: body.open,
        room: Number(body.room),
      },
    });

    return c.json({
      status: true,
      statusCode: 200,
      message: "Success update hospital",
      result: result,
    });
  } catch (error) {
    return c.json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      result: null,
    });
  }
});

hospitalApp.get("/:hospital_id", async (c) => {
  const hospitalId = c.req.param("hospital_id");
  try {
    const result = await prisma.hospital.findFirst({
      where: {
        id: hospitalId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        numberPhone: true,
        room: true,
        open: true,
      },
    });

    return c.json({
      status: true,
      statusCode: 200,
      message: "Success get hospital",
      result: result,
    });
  } catch (error) {
    return c.json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      result: null,
    });
  }
});

export default hospitalApp;
