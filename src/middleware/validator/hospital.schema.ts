import z from "zod";

export const createHospitalSchema = z.object({
  name: z.string().min(1, "Nama rumah sakit wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  email: z.email("Format email tidak valid").min(1, "Email wajib diisi"),
  numberPhone: z
    .string()
    .min(6, "Nomor telepon terlalu pendek")
    .max(20, "Nomor telepon terlalu panjang"),
  room: z.union([
    z.string().regex(/^\d+$/, "Room harus berupa angka").transform(Number),
    z.number(),
  ]),
  open: z.string().optional().default("24 jam"),
  admin_id: z.string().min(31, "Admin ID wajib diisi"),
  secure_url: z.url("URL gambar tidak valid").optional().nullable(),
  public_id: z.string().optional().nullable(),
});

export const updateHospitalSchema = z.object({
  name: z.string().min(1, "Nama rumah sakit wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  email: z.email("Format email tidak valid").min(1, "Email wajib diisi"),
  numberPhone: z
    .string()
    .min(6, "Nomor telepon terlalu pendek")
    .max(20, "Nomor telepon terlalu panjang"),
  room: z.union([
    z.string().regex(/^\d+$/, "Room harus berupa angka").transform(Number),
    z.number(),
  ]),
  open: z.string().optional().default("24 jam"),
  hospitalId: z.string().min(31, "Hospital ID wajib diisi"),
  secure_url: z.url("URL gambar tidak valid").optional().nullable(),
  public_id: z.string().optional().nullable(),
});

export const searchQuerySchema = z.object({
  keyword: z
    .string()
    .trim()
    .min(1, "Keyword tidak boleh kosong")
    .max(100, "Keyword terlalu panjang")
    .optional(),
});

export namespace HospitalSchemaType {
  export type CreateHopsitalT = z.infer<typeof createHospitalSchema>;
  export type UpdateHopsitalT = z.infer<typeof updateHospitalSchema>;
  export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
}
