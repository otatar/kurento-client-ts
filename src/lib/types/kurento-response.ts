import { z } from "zod";

export const KurentoResponseSchema = z.object({
  value: z.optional(z.string().nullable()),
  sessionId: z.optional(z.string()),
});

export type KurentoResponse = z.infer<typeof KurentoResponseSchema>;
