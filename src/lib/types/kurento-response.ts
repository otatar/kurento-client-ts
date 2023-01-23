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

const KurentoStringSchema = z.string().nullable().optional();

export function generateResponseSchema<T = string>(valueSchema?: z.Schema<T>) {
  if (valueSchema) {
    return z.object({
      value: valueSchema,
      sessionId: z.string().optional(),
    });
  }
  return z.object({
    value: KurentoStringSchema,
    sessionId: z.string().optional(),
  });
}
