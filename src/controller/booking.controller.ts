import { Hono } from "hono";
import { createBookingSchema } from "../middleware/validator/booking.schema.js";
import bookingService from "../services/booking.service.js";
import { ErrorZod } from "../utils/error-zod.js";
import { prisma } from "../lib/prisma-client.js";
import notifStore from "../services/firestore/notification.store.js";

const bookingApp = new Hono();

bookingApp.post("/", async (c) => {
  const body = await c.req.json();
  try {
    const parse = createBookingSchema.parse(body);
    const result = await bookingService.createBooking(parse);

    return c.json(
      {
        status: true,
        statusCode: 201,
        message: "Success update docter",
        result,
      },
      201
    );
  } catch (error) {
    console.log(error);
    return ErrorZod(error, c);
  }
});

bookingApp.put("/status/:booking_id", async (c) => {
  try {
    const booking_id = c.req.param("booking_id");
    const { status } = await c.req.json();

    const result = await prisma.booking.update({
      where: {
        id: booking_id,
      },
      data: {
        status,
      },
    });

    await notifStore.updateStatusBooking(
      result.userId,
      status,
      result.bookingNumber
    );

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success update docter",
        result,
      },
      200
    );
  } catch (error) {
    return ErrorZod(error, c);
  }
});

bookingApp.get("/list/:user_id", async (c) => {
  try {
    const userId = c.req.param("user_id");
    const result = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        docter: {
          select: {
            id: true,
            specialits: true,
            photoUrl: true,
            hospital: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get list booking",
        result,
      },
      200
    );
  } catch (error) {
    return ErrorZod(error, c);
  }
});

bookingApp.get("/detail/:booking_id", async (c) => {
  try {
    const result = await prisma.booking.findFirst({
      where: {
        id: c.req.param("booking_id"),
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get detail booking",
        result,
      },
      200
    );
  } catch (error) {
    return ErrorZod(error, c);
  }
});

export default bookingApp;
