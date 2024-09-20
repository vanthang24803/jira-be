import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().min(6).max(255),
  description: z.string().optional(),
  category: z.string().min(1).max(255),
});

type ProjectSchema = z.infer<typeof projectSchema>;

export type { ProjectSchema };
export { projectSchema };
