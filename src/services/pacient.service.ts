import { prisma } from "../lib/prisma-client.js";
import { startOfDay, endOfDay, subDays, addDays } from "date-fns";

const pacientService = {
  getPacientDocter: async (docter_id: string) => {
    const now = new Date();

    const from = startOfDay(subDays(now, 1)); // 1 hari lalu jam 00:00
    const to = endOfDay(addDays(now, 3)); // 3 hari ke depan jam 23:59

    const result = await prisma.booking.findMany({
      where: {
        docterId: docter_id,
        bookDateTime: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        bookDateTime: "asc",
      },
    });

    const statusOrder = {
      confirm: 1,
      canceled: 2,
      finish: 3,
    };

    // Sort lagi berdasarkan status
    const sorted = result.sort((a, b) => {
      return statusOrder[a.status] - statusOrder[b.status];
    });

    return sorted;
  },
};

export default pacientService;
