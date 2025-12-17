import { z } from "zod";

export const createBookingSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  userId: z.string().min(31, { message: "User id harus ada" }),
  noPhone: z
    .string()
    .regex(/^[0-9]+$/, { message: "Nomor telepon hanya boleh berisi angka" })
    .min(8, { message: "Nomor telepon minimal 8 digit" })
    .max(15, { message: "Nomor telepon maksimal 15 digit" }),
  bookDate: z.string().min(1, { message: "Tanggal booking wajib diisi" }),
  bookTime: z.string().min(1, { message: "Waktu booking wajib diisi" }),
  note: z.string().optional(),
  hospitalId: z.string().min(31, { message: "ID rumah sakit wajib diisi" }),
  docterId: z.string().min(31, { message: "ID dokter wajib diisi" }),
  status: z.enum(["confirm", "pending", "cancel"]).default("confirm"),
});

export namespace BookingSchemaT {
  export type CreateBookingInput = z.infer<typeof createBookingSchema>;
}
