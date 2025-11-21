import { generateId } from "better-auth";
import prisma from "../lib/prisma-client.js";
import { DocterSchemaType } from "../middleware/validator/docter.schema.js";
import AppError from "../utils/app-error.js";

const docterService = {
  createDocter: async (body: DocterSchemaType.CreateDocterInput) => {
    const hospital = await prisma.hospital.findFirst({
      where: {
        name: body.hospital_name,
      },
      select: {
        id: true,
      },
    });

    if (!hospital) {
      throw new AppError("Hospital not found", 422);
    }

    const docter = await prisma.docter.create({
      data: {
        userId: body.user_id,
        status: "unverified",
        id: generateId(32),
        specialits: body.specialits,
        schedule: JSON.parse(body.schedule),
        hospitalId: String(hospital?.id),
        photoId: body.public_id,
        photoUrl: body.secure_url,
      },
    });

    await prisma.user.update({
      where: {
        id: body.user_id,
      },
      data: {
        name: body.name,
        role: "Docter",
      },
    });

    return docter;
  },
  updateDocterSchema: async (body: DocterSchemaType.UpdateDocterInput) => {
    return await prisma.docter.update({
      where: {
        id: body.docterId,
      },
      data: {
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
        specialits: true,
        photoUrl: true,
        user: {
          select: {
            name: true,
          },
        },
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
