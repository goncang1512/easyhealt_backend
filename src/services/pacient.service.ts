import { prisma } from "../lib/prisma-client.js";

const pacientService = {
  getPacientDocter: async (docter_id: string) => {
    const today = new Date().toISOString();
    const next30 = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    return await prisma.booking.findMany({
      where: {
        docterId: docter_id,
      },
      orderBy: {
        bookDateTime: "asc",
      },
    });
  },
};

export default pacientService;
