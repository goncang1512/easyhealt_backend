import { generateId } from "better-auth";
import prisma from "../lib/prisma-client.js";
import { DocterSchemaType } from "../middleware/validator/docter.schema.js";

const docterService = {
  createDocter: async (body: DocterSchemaType.CreateDocterInput) => {
    return await prisma.docter.create({
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
  },
  updateDocterSchema: async (body: DocterSchemaType.UpdateDocterInput) => {
    return await prisma.docter.update({
      where: {
        id: body.docterId,
      },
      data: {
        name: body.name,
        specialits: body.specialits,
        schedule: JSON.parse(body.schedule),
        photoId: body.public_id,
        photoUrl: body.secure_url,
      },
    });
  },
  getDocterHospital: async (hospitalId: string) => {
    return await prisma.docter.findMany({
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
  },
  getDetailDocter: async (docterId: string) => {
    return await prisma.docter.findFirst({
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
  },
};

export default docterService;
