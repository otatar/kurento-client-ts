import { z } from "zod";

export const KurentoErrorSchema = z.object({
  //jsonrpc: z.literal("2.0"),
  //id: z.number(),
  code: z.number(),
  message: z.string(),
  data: z.optional(z.any()),
});

export type KurentoError = z.infer<typeof KurentoErrorSchema>;
