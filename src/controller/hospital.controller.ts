import prisma from "../lib/prisma-client.js";
import type { Prisma } from "@prisma/client";
import { generateId } from "better-auth";
import { Hono } from "hono";
import cloudinary from "src/lib/cloudinary.js";

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
        image: body.secure_url ?? null,
        imageId: body.public_id ?? null,
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
        image: body.secure_url,
        imageId: body.public_id,
      },
    });

    if (body.old_public) {
      await cloudinary.uploader.destroy(body.old_public);
    }

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
        image: true,
        imageId: true,
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

hospitalApp.get("/detail/:hospital_id", async (c) => {
  const hospitalId = c.req.param("hospital_id");
  try {
    const result = await prisma.hospital.findFirst({
      where: {
        id: hospitalId,
      },
      select: {
        id: true,
        name: true,
        address: true,
        image: true,
        room: true,
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get detail hospital",
        result,
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

export default hospitalApp;
