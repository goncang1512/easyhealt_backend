import { generateId } from "better-auth";
import { Hono } from "hono";
import prisma from "../lib/prisma-client.js";

const bookingApp = new Hono();

type BookingBody = {
  name: string;
  noPhone: string;
  bookDate: string; // gunakan string karena JSON tidak bisa langsung kirim DateTime
  bookTime: string;
  note?: string;
  hospitalId: string;
  docterId: string;
};

bookingApp.post("/", async (c) => {
  const body: BookingBody = await c.req.json();
  try {
    const result = await prisma.booking.create({
      data: {
        id: generateId(32),
        name: body.name,
        bookDate: body.bookDate,
        bookTime: body.bookTime,
        noPhone: body.noPhone,
        docterId: body.docterId,
        hospitalId: body.hospitalId,
        status: "confirm",
      },
    });

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
    return c.json(
      {
        status: false,
        statusCode: 500,
        message: "Internal Server Error",
        result: null,
      },
      500
    );
  }
});

export default bookingApp;
