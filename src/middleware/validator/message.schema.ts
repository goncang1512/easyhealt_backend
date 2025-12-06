import z from "zod";

export const createRoomSchema = z.object({
  senderId: z.string().min(31, "Pengirim ID wajib di isi"),
  hospitalId: z.string().min(31, "Penerima ID wajib di isi"),
});

export const sendChatSchema = z.object({
  senderId: z.string().min(31, "Pengirim ID wajib di isi"),
  roomId: z.string().min(31, "Room ID wajib di isi"),
  text: z.string().min(1, "Pesan harus di isi"),
});

export namespace MessageSchemaType {
  export type createRoomInput = z.infer<typeof createRoomSchema>;
  export type createChatInput = z.infer<typeof sendChatSchema>;
}
