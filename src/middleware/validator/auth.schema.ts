import z from "zod";

export const registrasiSchema = z
  .object({
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.email("Email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
        "Password harus mengandung huruf dan angka"
      ),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // lokasi error ditaruh di confirmPassword
    message: "Konfirmasi password tidak sama",
  });

export const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
      "Password harus mengandung huruf dan angka"
    ),
});
