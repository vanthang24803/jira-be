import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
});

type RegisterSchema = z.infer<typeof registerSchema>;

export type { RegisterSchema };
export { registerSchema };
