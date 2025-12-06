import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { MessageSchemaType } from "../../middleware/validator/message.schema.js";
import { firestoreDb } from "../../lib/firebase.js";
import { generateId } from "better-auth";

const roomStore = {
  createRoom: async (body: MessageSchemaType.createRoomInput) => {
    const [userAId, hospitalId] = [body.senderId, body.hospitalId].sort();

    const bodyRoom = {
      userAId,
      hospitalId,
    };
    const q = query(
      collection(firestoreDb, "room"),
      where("userAId", "==", userAId),
      where("hospitalId", "==", hospitalId)
    );

    const snapshot = await getDocs(q);

    // Jika sudah ada, return room yang ditemukan
    if (!snapshot.empty) {
      const docExist = snapshot.docs[0];
      return {
        id: docExist.id,
        ...docExist.data(),
      };
    }

    // 🆕 2. Kalau belum ada, buat baru
    const document = doc(firestoreDb, "room", generateId(32));
    await setDoc(document, bodyRoom);
    return {
      id: document.id,
      ...bodyRoom,
    };
  },
};

export default roomStore;
