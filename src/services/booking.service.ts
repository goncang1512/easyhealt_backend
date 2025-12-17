import { generateId } from "better-auth";
import { prisma } from "../lib/prisma-client.js";
import { BookingSchemaT } from "../middleware/validator/booking.schema.js";
import { parse } from "date-fns";
import notifStore from "./firestore/notification.store.js";

const bookingService = {
  createBooking: async (body: BookingSchemaT.CreateBookingInput) => {
    // ✅ Normalisasi waktu: pastikan ada spasi sebelum AM/PM
    const normalizedTime = body.bookTime.replace(/(AM|PM)$/i, " $1");

    const combined = `${body.bookDate} ${normalizedTime}`;
    // contoh hasil: 2025-12-15 12:00 AM

    const parsedDate = parse(combined, "yyyy-MM-dd h:mm a", new Date());

    if (isNaN(parsedDate.getTime())) {
      console.error("INVALID DATE INPUT:", {
        bookDate: body.bookDate,
        bookTime: body.bookTime,
        combined,
      });
      throw new Error("Invalid date format");
    }

    const dateTimeISO = parsedDate.toISOString();

    const docter = await prisma.docter.findFirst({
      where: {
        id: body.docterId,
      },
      select: {
        prefix: true,
        booking: {
          select: {
            id: true,
          },
        },
      },
    });

    return await prisma.booking.create({
      data: {
        id: generateId(32),
        name: body.name,
        bookDate: body.bookDate,
        bookTime: normalizedTime, // ✅ simpan versi yang sudah rapi
        noPhone: body.noPhone,
        docterId: body.docterId,
        hospitalId: body.hospitalId,
        note: body.note,
        bookDateTime: dateTimeISO,
        status: "confirm",
        userId: body.userId,
        bookingNumber: `${docter?.prefix}-${(docter?.booking.length ?? 0) + 1}`,
      },
    });
  },
  deleteBooking: async (booking_id: string) => {
    const result = await prisma.booking.delete({
      where: {
        id: booking_id,
      },
      select: {
        bookingNumber: true,
        hospital: {
          select: {
            name: true,
            admin: {
              select: {
                id: true,
                userId: true,
              },
            },
          },
        },
        docter: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    await notifStore.updateStatusBooking(
      result.docter.userId,
      "canceled",
      result.bookingNumber,
      result.hospital.name,
      "pasien",
      result.hospital.admin.map((item) => item.userId)
    );

    return result;
  },
};

export default bookingService;
