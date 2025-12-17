import { generateId } from "better-auth";
import { Prisma, prisma } from "../lib/prisma-client.js";
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
            {
              name: {
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

    let docters: Prisma.DocterGetPayload<{
      select: {
        id: true;
        specialits: true;
        photoUrl: true;
        user: {
          select: {
            name: true;
          };
        };
        hospital: {
          select: {
            name: true;
          };
        };
      };
    }>[] = [];

    if (keyword) {
      const whereDocter: Prisma.DocterWhereInput = keyword
        ? {
            status: "verified",
            user: {
              name: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          }
        : {
            status: "verified",
          };

      docters = await prisma.docter.findMany({
        where: whereDocter,
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
      });
    }

    return {
      results,
      docters: docters.map((item) => ({ ...item, name: item.user.name })),
    };
  },

  createHospital: async (body: HospitalSchemaType.CreateHopsitalT) => {
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

    await prisma.user.update({
      where: {
        id: body.admin_id,
      },
      data: {
        role: "Admin",
      },
    });

    return result;
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
    const hospital = await prisma.hospital.findFirst({
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
          where: {
            status: "verified",
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

    const docter = hospital?.docter.map((item) => ({
      ...item,
      name: item.user.name,
    }));

    return { ...hospital, docter };
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
