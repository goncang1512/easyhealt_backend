import { Prisma } from "@prisma/client";
import { generateId } from "better-auth";
import prisma from "../lib/prisma-client.js";
import { HospitalSchemaType } from "../middleware/validator/hospital.schema.js";

const hospitalService = {
  searchHospital: async (keyword: string | undefined) => {
    const where: Prisma.HospitalWhereInput = keyword
      ? {
          OR: [
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

    const docters = await prisma.docter.findMany({
      select: {
        id: true,
        specialits: true,
        photoUrl: true,
        hospital: {
          select: {
            name: true,
          },
        },
      },
    });

    return { results, docters };
  },

  createHospital: async (body: HospitalSchemaType.CreateHopsitalT) => {
    return await prisma.hospital.create({
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
  },

  updateHospital: async (body: HospitalSchemaType.UpdateHopsitalT) => {
    return await prisma.hospital.update({
      where: {
        id: body.hospitalId,
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
  },

  getDetailHospital: async (hospitalId: string) => {
    return await prisma.hospital.findFirst({
      where: {
        id: hospitalId,
      },
      select: {
        id: true,
        name: true,
        address: true,
        image: true,
        room: true,
        docter: {
          select: {
            id: true,
            specialits: true,
            photoUrl: true,
          },
        },
        admin: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: [
            {
              user: {
                lastSeen: { sort: "asc", nulls: "first" }, // ❌ hanya tersedia di Prisma v6 ke atas
              },
            },
            {
              user: {
                lastSeen: "desc",
              },
            },
          ],
        },
      },
    });
  },

  getUpdateDetailHospital: async (hospitalId: string) => {
    return await prisma.hospital.findFirst({
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
  },
};

export default hospitalService;
