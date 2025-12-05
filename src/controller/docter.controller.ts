import { Hono } from "hono";
import cloudinary from "../lib/cloudinary.js";
import { prisma } from "../lib/prisma-client.js";
import {
  createDocterSchema,
  updateDocterSchema,
} from "../middleware/validator/docter.schema.js";
import docterService from "../services/docter.service.js";
import { z } from "zod";
import { ErrorZod } from "../utils/error-zod.js";
import pacientService from "../services/pacient.service.js";

const docterApp = new Hono();

docterApp.post("/", async (c) => {
  const body = await c.req.json();
  try {
    const parse = createDocterSchema.parse(body);
    const result = docterService.createDocter(parse);

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
    return ErrorZod(error, c);
  }
});

docterApp.get("/:hospital_id", async (c) => {
  const hospitalId = c.req.param("hospital_id");

  try {
    const parse = z
      .object({
        hospitalId: z.string().min(31, "Hospital id wajib di isi"),
      })
      .parse({ hospitalId });

    const result = await docterService.getDocterHospital(parse.hospitalId);

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
    return ErrorZod(error, c);
  }
});

docterApp.get("/edit-detail/:docter_id", async (c) => {
  const docterId = c.req.param("docter_id");

  try {
    const parse = z
      .object({
        docterId: z.string().min(31, "Hospital id wajib di isi"),
      })
      .parse({ docterId });

    const result = await prisma.docter.findFirst({
      where: {
        id: parse.docterId,
      },
      select: {
        id: true,
        specialits: true,
        photoUrl: true,
        photoId: true,
        schedule: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success Get docter detail",
        result: { ...result, name: result?.user.name },
      },
      200
    );
  } catch (error) {
    return ErrorZod(error, c);
  }
});

docterApp.put("/edit-docter/:docter_id", async (c) => {
  const docterId = c.req.param("docter_id");
  const body = await c.req.json();
  try {
    const parse = updateDocterSchema.parse({ ...body, docterId });

    const result = await docterService.updateDocterSchema(parse);

    if (parse.old_public && parse.old_public !== parse.public_id) {
      await cloudinary.uploader.destroy(parse.old_public);
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
    return ErrorZod(error, c);
  }
});

docterApp.get("/detail-docter/:docter_id", async (c) => {
  const docterId = c.req.param("docter_id");
  try {
    const parse = z
      .object({
        docterId: z.string().min(31, "Hospital id wajib di isi"),
      })
      .parse({ docterId });

    const result = await docterService.getDetailDocter(parse.docterId);

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
    return ErrorZod(error, c);
  }
});

docterApp.get("/dashboard/:docter_id", async (c) => {
  const docterId = c.req.param("docter_id");
  try {
    const parse = z
      .object({
        docterId: z.string().min(31, "Docter id wajib di isi"),
      })
      .parse({ docterId });

    const result = await pacientService.getPacientDocter(parse.docterId);

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
    return ErrorZod(error, c);
  }
});

docterApp.put("/status/:docter_id", async (c) => {
  try {
    const docter_id = c.req.param("docter_id");
    const { status } = await c.req.json();

    const result = await prisma.docter.update({
      where: {
        id: docter_id,
      },
      data: {
        status,
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
    return ErrorZod(error, c);
  }
});

export default docterApp;
