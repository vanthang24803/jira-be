import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

const tokenSchema = z.object({
  token: z.string().min(1),
});

type LoginSchema = z.infer<typeof loginSchema>;
type TokenSchema = z.infer<typeof tokenSchema>;
type RegisterSchema = z.infer<typeof registerSchema>;

export type { RegisterSchema, LoginSchema, TokenSchema };
export { registerSchema, loginSchema, tokenSchema };
