import { z } from "zod";

export const createDocterSchema = z.object({
  name: z.string().min(1, "Nama dokter wajib diisi"),
  specialits: z.string().min(1, "Spesialis wajib diisi"),
  schedule: z
    .string()
    .min(2, "Jadwal wajib diisi")
    .refine((val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }, "Format schedule harus JSON yang valid"),
  user_id: z.string().min(31, "User ID wajib diisi"),
  hospital_name: z.string().min(1, "Hospital Name wajib diisi"),
  public_id: z.string().min(1, "Public ID gambar wajib diisi"),
  secure_url: z.url("URL gambar tidak valid"),
});

export const updateDocterSchema = z.object({
  name: z.string().min(1, "Nama dokter wajib diisi"),
  specialits: z.string().min(1, "Spesialis wajib diisi"),
  schedule: z
    .string()
    .min(2, "Jadwal wajib diisi")
    .refine((val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }, "Format schedule harus JSON yang valid"),
  docterId: z.string().min(31, "Docter ID wajib diisi"),
  public_id: z.string().min(1, "Public ID gambar wajib diisi"),
  old_public: z.string().min(1, "Old Public ID gambar wajib diisi"),
  secure_url: z.url("URL gambar tidak valid"),
});

export namespace DocterSchemaType {
  export type CreateDocterInput = z.infer<typeof createDocterSchema>;
  export type UpdateDocterInput = z.infer<typeof updateDocterSchema>;
}
