import { doc, setDoc } from "firebase/firestore";
import { MessageSchemaType } from "../../middleware/validator/message.schema.js";
import { firestoreDb } from "../../lib/firebase.js";
import { generateId } from "better-auth";

const messageStore = {
  sendMessage: async (body: MessageSchemaType.createChatInput) => {
    const bodyMessage = {
      senderId: body.senderId,
      roomid: body.roomId,
      text: body.text,
      createdAt: new Date(),
    };

    const id = generateId(32);

    const document = doc(firestoreDb, "message", id);
    const response = await setDoc(document, bodyMessage);

    return response;
  },
};

export default messageStore;
