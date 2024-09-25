import { z } from "zod";

const memberSchema = z.lazy(() =>
  z.object({
    _id: z.string(),
    email: z.string().email(),
    fullName: z.string(),
    avatar: z.string(),
    role: z.string(),
  }),
);

const taskSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string(),
  reporter: memberSchema,
  assignees: z.array(memberSchema),
  description: z.string().optional(),
  level: z.string().min(1).max(255),
  status: z.string(),
});

type TaskSchema = z.infer<typeof taskSchema>;

export type { TaskSchema };
export { taskSchema };
