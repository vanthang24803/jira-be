import { z } from "zod";

const taskSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string(),
  description: z.string().optional(),
  level: z.string().min(1).max(255),
  status: z.string().min(1).max(255),
});

type TaskSchema = z.infer<typeof taskSchema>;

export type { TaskSchema };
export { taskSchema };
