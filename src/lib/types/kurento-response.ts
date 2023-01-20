import { z } from 'zod';
import { ElementConnectionSchema } from './core-types';

export const KurentoResponseSchema = z.object({
  value: z
    .union([z.string(), z.array(ElementConnectionSchema)])
    .nullable()
    .optional(),
  sessionId: z.string().optional(),
});

export type KurentoResponse = z.infer<typeof KurentoResponseSchema>;
