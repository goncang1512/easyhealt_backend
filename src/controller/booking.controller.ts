import { Hono } from "hono";
import { createBookingSchema } from "../middleware/validator/booking.schema.js";
import bookingService from "../services/booking.service.js";
import { ErrorZod } from "../utils/error-zod.js";

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

export default bookingApp;
