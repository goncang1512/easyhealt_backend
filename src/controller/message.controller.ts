import { Hono } from "hono";
import messageService from "../services/message.service.js";
import { ErrorZod } from "../utils/error-zod.js";
import {
  createRoomSchema,
  sendChatSchema,
} from "../middleware/validator/message.schema.js";
import z from "zod";
import messageStore from "../services/firestore/message.store.js";
import roomStore from "../services/firestore/room.store.js";

const messageApp = new Hono();

messageApp.post("/room", async (c) => {
  const { senderId, hospitalId } = await c.req.json();
  try {
    const parse = createRoomSchema.parse({ senderId, hospitalId });

    const rseult = await roomStore.createRoom(parse);

    return c.json(
      {
        status: true,
        statusCode: 201,
        message: "Success create room",
        result: rseult,
      },
      201
    );
  } catch (error) {
    console.log(error);

    return ErrorZod(error, c);
  }
});

messageApp.post("/chat", async (c) => {
  const { senderId, roomId, text } = await c.req.json();
  try {
    const parse = sendChatSchema.parse({ senderId, roomId, text });

    const message = await messageStore.sendMessage(parse);

    return c.json(
      {
        status: true,
        statusCode: 201,
        message: "Success create message",
        result: message as any,
      },
      201
    );
  } catch (error) {
    return ErrorZod(error, c);
  }
});

messageApp.get("/conversation/:room_id", async (c) => {
  const roomId = c.req.param("room_id");
  try {
    const parse = z
      .object({
        roomId: z.string().min(1, "Room ID wajib di isi"),
      })
      .parse({ roomId });

    const result = await messageService.getConversation(parse.roomId);

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get room conversation",
        result: result,
      },
      200
    );
  } catch (error) {
    return ErrorZod(error, c);
  }
});

export default messageApp;
