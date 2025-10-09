import { generateId } from "better-auth";
import { Hono } from "hono";
import cloudinary from "../lib/cloudinary.js";
import prisma from "../lib/prisma-client.js";

const docterApp = new Hono();

type CrateDocter = {
  name: string;
  specialits: string;
  schedule: string;
  hospital_id: string;
  secure_url: string;
  public_id: string;
};

docterApp.post("/", async (c) => {
  const body: CrateDocter = await c.req.json();
  try {
    const result = await prisma.docter.create({
      data: {
        id: generateId(32),
        name: body.name,
        specialits: body.specialits,
        schedule: JSON.parse(body.schedule),
        hospitalId: body.hospital_id,
        photoId: body.public_id,
        photoUrl: body.secure_url,
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 201,
        message: "Success create docter",
        result,
      },
      201
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

docterApp.get("/:hospital_id", async (c) => {
  const hospitalId = c.req.param("hospital_id");
  try {
    const result = await prisma.docter.findMany({
      where: {
        hospitalId,
      },
      select: {
        id: true,
        name: true,
        specialits: true,
        photoUrl: true,
        hospital: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 201,
        message: "Success create docter",
        result,
      },
      201
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

docterApp.get("/edit-detail/:docter_id", async (c) => {
  const docterId = c.req.param("docter_id");
  try {
    const result = await prisma.docter.findFirst({
      where: {
        id: docterId,
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success Get docter detail",
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

docterApp.put("/edit-docter/:docter_id", async (c) => {
  const docterId = c.req.param("docter_id");
  const body = await c.req.json();
  try {
    const result = await prisma.docter.update({
      where: {
        id: docterId,
      },
      data: {
        name: body.name,
        specialits: body.specialits,
        schedule: JSON.parse(body.schedule),
        photoId: body.public_id,
        photoUrl: body.secure_url,
      },
    });

    if (body.old_public && body.old_public !== body.public_id) {
      await cloudinary.uploader.destroy(body.old_public);
    }

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success update docter",
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

docterApp.get("/detail-docter/:docter_id", async (c) => {
  const docterId = c.req.param("docter_id");
  try {
    const result = await prisma.docter.findFirst({
      where: {
        id: docterId,
      },
      select: {
        id: true,
        name: true,
        specialits: true,
        photoUrl: true,
        hospital: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success update docter",
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

export default docterApp;
