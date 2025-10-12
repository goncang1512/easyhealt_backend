import { addHours, format, subHours } from "date-fns";
import { id } from "date-fns/locale";
import prisma from "../lib/prisma-client.js";

const adminService = {
  getStatsToday: async (hospitalId: string) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const currentDayRaw = format(new Date(), "EEEE", { locale: id }); // contoh: 'minggu'
    const currentDay =
      currentDayRaw.charAt(0).toUpperCase() + currentDayRaw.slice(1);

    // 1️⃣ Booking hari ini
    const bookingHariIni = await prisma.booking.count({
      where: {
        hospitalId,
        bookDate: today,
      },
    });

    // 2️⃣ Dokter aktif (cek JSON field schedule)
    const dokterAktif = await prisma.docter.count({
      where: {
        hospitalId,
        schedule: {
          path: [currentDay, "active"], // misal ['minggu']
          equals: true,
        },
      },
    });

    // 3️⃣ Selesai hari ini
    const selesai = await prisma.booking.count({
      where: {
        hospitalId,
        bookDate: today,
        status: "finish",
      },
    });

    // 4️⃣ Dibatalkan hari ini
    const dibatalkan = await prisma.booking.count({
      where: {
        hospitalId,
        bookDate: today,
        status: "canceled",
      },
    });

    const bookingRange = await adminService.getBookingInRange(hospitalId);

    return {
      bookingHariIni,
      dokterAktif,
      selesai,
      dibatalkan,
      bookRange: bookingRange,
    };
  },
  getBookingInRange: async (hospitalId: string) => {
    const now = new Date();
    const startRange = subHours(now, 2); // 2 jam ke belakang
    const endRange = addHours(now, 6); // 6 jam ke depan

    // Ambil semua booking untuk hari ini
    return await prisma.booking.findMany({
      where: {
        hospitalId,
        bookDateTime: {
          gte: startRange,
          lte: endRange,
        },
      },
      select: {
        id: true,
        name: true,
        bookDate: true,
        bookTime: true,
        status: true,
        docter: {
          select: {
            name: true,
          },
        },
      },
    });
  },
};

export default adminService;
