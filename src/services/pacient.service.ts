import prisma from "src/lib/prisma-client.js";

const pacientService = {
  getPacientDocter: async (docter_id: string) => {
    const today = new Date();
    const next30 = new Date();
    next30.setDate(today.getDate() + 30);

    return await prisma.booking.findMany({
      where: {
        docterId: docter_id,
        bookDateTime: {
          gte: today,
          lte: next30,
        },
      },
      orderBy: {
        bookDateTime: "asc",
      },
    });
  },
};

export default pacientService;
