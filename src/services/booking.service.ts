import { generateId } from "better-auth";
import { prisma } from "../lib/prisma-client.js";
import { BookingSchemaT } from "../middleware/validator/booking.schema.js";
import { parse } from "date-fns";

const bookingService = {
  createBooking: async (body: BookingSchemaT.CreateBookingInput) => {
    const combined = `${body.bookDate} ${body.bookTime}`;

    // Format yang benar untuk: 2025-12-15 12:00 AM
    const parsedDate = parse(combined, "yyyy-MM-dd h:mm a", new Date());

    if (isNaN(parsedDate.getTime())) {
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
        bookTime: body.bookTime,
        noPhone: body.noPhone,
        docterId: body.docterId,
        hospitalId: body.hospitalId,
        note: body.note,
        bookDateTime: dateTimeISO,
        status: "confirm",
        userId: body.userId,
        bookingNumber: `${docter?.prefix}-${(docter?.booking.length ?? 1) + 1}`,
      },
    });
  },
};

export default bookingService;
