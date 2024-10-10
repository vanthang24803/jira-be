import { z } from "zod";

const commentValidation = z.object({
  content: z.string().min(1, {
    message: "Content is required",
  }),
});

type CommentSchema = z.infer<typeof commentValidation>;

export { commentValidation, type CommentSchema };
