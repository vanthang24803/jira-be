import { z } from "zod";

const profileSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  avatar: z.string().optional().default(""),
  isVerifyEmail: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type ProfileSchema = z.infer<typeof profileSchema>;

export type { ProfileSchema };

export { profileSchema };
