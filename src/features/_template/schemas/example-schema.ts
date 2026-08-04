import { z } from "zod";

export const exampleSchema = z.object({
  name: z.string().min(1, "Required"),
});

export type ExampleFormValues = z.infer<typeof exampleSchema>;
