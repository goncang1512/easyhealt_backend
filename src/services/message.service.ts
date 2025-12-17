import { generateId } from "better-auth";
import { prisma } from "../lib/prisma-client.js";
import { MessageSchemaType } from "../middleware/validator/message.schema.js";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { firestoreDb } from "../lib/firebase.js";
import AppError from "../utils/app-error.js";

const messageService = {
  createRoom: async (body: MessageSchemaType.createRoomInput) => {
    const [userAId, userBId] = [body.senderId, body.hospitalId].sort();

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

  getChatHospital: async (roomId: string) => {
    const ref = doc(firestoreDb, "room", roomId);
    const snap = await getDoc(ref);

    if (!snap.exists) throw new AppError("Tidak ada room", 422);

    const room = snap.data() as DocumentData | { hospitalId: string };

    const result = await prisma.hospital.findFirst({
      where: {
        id: room.hospitalId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    console.log({ result, room });

    return result;
  },
};

export default messageService;
