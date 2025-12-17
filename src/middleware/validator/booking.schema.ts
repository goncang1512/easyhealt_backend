import { z } from "zod";

export const createBookingSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  userId: z.string().min(31, { message: "User id harus ada" }),
  noPhone: z
    .string()
    .regex(/^[0-9]+$/, { message: "Nomor telepon hanya boleh berisi angka" })
    .min(8, { message: "Nomor telepon minimal 8 digit" })
    .max(15, { message: "Nomor telepon maksimal 15 digit" }),
  // bookDate: z
  //   .string()
  //   .min(1, { message: "Tanggal booking wajib diisi" })
  //   .transform((val) => {
  //     const [day, month, year] = val.split("/");
  //     return `${year}-${month}-${day}`; // hasil jadi YYYY-MM-DD
  //   }),
  // bookTime: z
  //   .string()
  //   .min(1, { message: "Waktu booking wajib diisi" })
  //   .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i, {
  //     message: "Format waktu harus hh:mm AM/PM",
  //   }),
  note: z.string().optional(),
  hospitalId: z.string().min(31, { message: "ID rumah sakit wajib diisi" }),
  docterId: z.string().min(31, { message: "ID dokter wajib diisi" }),
  status: z.enum(["confirm", "pending", "cancel"]).default("confirm"),
});

export namespace BookingSchemaT {
  export type CreateBookingInput = z.infer<typeof createBookingSchema>;
}
