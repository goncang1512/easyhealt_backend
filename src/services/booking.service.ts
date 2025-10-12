import { generateId } from "better-auth";
import prisma from "../lib/prisma-client.js";
import { BookingSchemaT } from "../middleware/validator/booking.schema.js";
import { formatISO, parse } from "date-fns";

const bookingService = {
  createBooking: async (body: BookingSchemaT.CreateBookingInput) => {
    const combined = `${body.bookDate} ${body.bookTime}`;

    const parsedDate = parse(combined, "yyyy-MM-dd h:mm a", new Date());
    const dateTimeISO = formatISO(parsedDate);

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
      },
    });
  },
};

export default bookingService;
