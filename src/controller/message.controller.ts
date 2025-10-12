import { Hono } from "hono";
import prisma from "../lib/prisma-client.js";
import { generateId } from "better-auth";

const messageApp = new Hono();

messageApp.post("/room", async (c) => {
  const { senderId, receiverId } = await c.req.json();
  try {
    if (!senderId || !receiverId) {
      return c.json(
        {
          status: false,
          statusCode: 400,
          message: "senderId and receiverId required",
          result: null,
        },
        400
      );
    }

    const [userAId, userBId] = [senderId, receiverId].sort();

    // cari room yang sudah ada
    let room = await prisma.room.findFirst({
      where: { userAId, userBId },
      select: {
        id: true,
        message: {
          select: {
            text: true,
          },
        },
      },
    });

    // jika belum ada, buat
    if (!room) {
      room = await prisma.room.create({
        data: {
          id: generateId(32),
          userAId,
          userBId,
        },
        select: {
          id: true,
          message: {
            select: {
              text: true,
            },
          },
        },
      });
    }

    return c.json(
      {
        status: false,
        statusCode: 201,
        message: "Success create room",
        result: room,
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

messageApp.post("/chat", async (c) => {
  const { senderId, roomId, text } = await c.req.json();
  try {
    const message = await prisma.message.create({
      data: {
        id: generateId(32),
        userId: senderId,
        roomId: roomId,
        text,
      },
    });

    return c.json(
      {
        status: false,
        statusCode: 201,
        message: "Success create message",
        result: message,
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

export default messageApp;
