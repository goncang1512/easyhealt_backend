import { generateId } from "better-auth";
import { prisma } from "../lib/prisma-client.js";
import { MessageSchemaType } from "../middleware/validator/message.schema.js";

const messageService = {
  createRoom: async (body: MessageSchemaType.createRoomInput) => {
    const [userAId, userBId] = [body.senderId, body.receiverId].sort();

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

    return room;
  },

  getConversation: async (roomId: string) => {
    return await prisma.message.findMany({
      where: {
        roomId,
      },
    });
  },
};

export default messageService;
