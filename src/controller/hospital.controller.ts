import prisma from "../lib/prisma-client.js";
import { Hono } from "hono";
import cloudinary from "../lib/cloudinary.js";
import {
  createHospitalSchema,
  searchQuerySchema,
  updateHospitalSchema,
} from "../middleware/validator/hospital.schema.js";
import z from "zod";
import hospitalService from "../services/hospital.service.js";
import { ErrorZod } from "../utils/error-zod.js";

const hospitalApp = new Hono();

hospitalApp.post("/", async (c) => {
  const body = await c.req.json();

  try {
    const parse = createHospitalSchema.parse(body);
    const result = await hospitalService.createHospital(parse);

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
    return ErrorZod(error, c);
  }
});

hospitalApp.get("/", async (c) => {
  try {
    const query = searchQuerySchema.safeParse({
      keyword: c.req.query("keyword"),
    });

    const keyword =
      query.success && query.data.keyword ? query.data.keyword : undefined;

    const data = await hospitalService.searchHospital(keyword);

    return c.json({
      status: true,
      statusCode: 200,
      message: "Success find hospital",
      result: { results: data.results, docters: data.docters },
    });
  } catch (error) {
    return ErrorZod(error, c);
  }
});

hospitalApp.delete("/:hospital_id", async (c) => {
  const hospitalId = c.req.param("hospital_id");
  try {
    const parse = z
      .object({
        hospitalId: z.string().min(1, "Hospital ID wajib diisi"),
      })
      .parse({ hospitalId });

    const result = await prisma.hospital.delete({
      where: {
        id: parse.hospitalId,
      },
    });

    return c.json({
      status: true,
      statusCode: 200,
      message: "Success delete hospital",
      result: result,
    });
  } catch (error) {
    return ErrorZod(error, c);
  }
});

hospitalApp.put("/edit/:hospital_id", async (c) => {
  const body = await c.req.json();
  const hospitalId = c.req.param("hospital_id");

  try {
    const parse = updateHospitalSchema.parse({ ...body, hospitalId });

    const result = hospitalService.updateHospital(parse);

    if (body.old_public && body.old_public !== body.public_id) {
      await cloudinary.uploader.destroy(body.old_public);
    }

    return c.json({
      status: true,
      statusCode: 200,
      message: "Success update hospital",
      result: result,
    });
  } catch (error) {
    return ErrorZod(error, c);
  }
});

hospitalApp.get("/:hospital_id", async (c) => {
  const hospitalId = c.req.param("hospital_id");
  try {
    const parse = z
      .object({
        hospitalId: z.string().min(1, "Hospital ID wajib diisi"),
      })
      .parse({ hospitalId });

    const result = await hospitalService.getUpdateDetailHospital(
      parse.hospitalId
    );

    return c.json({
      status: true,
      statusCode: 200,
      message: "Success get hospital",
      result: result,
    });
  } catch (error) {
    return ErrorZod(error, c);
  }
});

hospitalApp.get("/detail/:hospital_id", async (c) => {
  const hospitalId = c.req.param("hospital_id");
  try {
    const parse = z
      .object({
        hospitalId: z.string().min(1, "Hospital ID wajib diisi"),
      })
      .parse({ hospitalId });

    const result = await hospitalService.getDetailHospital(parse.hospitalId);

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
    return ErrorZod(error, c);
  }
});

export default hospitalApp;
