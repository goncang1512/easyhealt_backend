import { generateId } from "better-auth";
import { Hono } from "hono";
import prisma from "../lib/prisma-client.js";

const bookApp = new Hono();

interface BodyCreateBooking {
  name: string;
  noPhone: string;
  bookDate: Date;
  bookTime: string;
  note?: string;
  hospitalId: string;
  docterId: string;
}

bookApp.post("/", async (c) => {
  const body: BodyCreateBooking = await c.req.json();

  try {
    const result = await prisma.booking.create({
      data: {
        id: generateId(32),
        name: body.name,
        noPhone: body.noPhone,
        bookDate: body.bookDate,
        bookTime: body.bookTime,
        note: body.note,
        hospitalId: body.hospitalId,
        docterId: body.docterId,
        status: "confirm",
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 201,
        message: "Success create booking",
        results: result,
      },
      201
    );
  } catch (error) {
    return c.json(
      {
        status: false,
        statusCode: 500,
        message: "Internal Server Error",
        results: null,
      },
      500
    );
  }
});

export default bookApp;
