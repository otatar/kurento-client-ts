import { z } from 'zod';
//import { ElementConnectionSchema } from './core-types';

/*export const KurentoResponseSchema = z.object({
  value: z
    .union([z.string(), z.array(ElementConnectionSchema)])
    .nullable()
    .optional(),
  sessionId: z.string().optional(),
});

export type KurentoResponse = z.infer<typeof KurentoResponseSchema>;
const KurentoStringSchema = z.string().nullable().optional();

export function generateResponseSchema<T extends z.ZodTypeAny>(
  valueSchema?: T
) {
  return z.object({
    value: valueSchema ? valueSchema : KurentoStringSchema,
    sessionId: z.string().optional(),
  });
}*/

export function createResponseSchema<T>(schema: z.Schema<T>) {
  return z.object({
    value: schema,
    sessionId: z.string(),
  });
}

export const DescribeResponseSchema = z.object({
  hierarchy: z.array(z.string()),
  qualifiedType: z.string(),
  type: z.string(),
  sessionId: z.string(),
});

export const PingResponseSchema = z.object({
  value: z.literal('pong'),
});

export const ValueStringResponseSchema = z.object({
  value: z.string(),
  sessionId: z.string(),
});

export const ValueStringArrayResponseSchema = z.object({
  value: z.array(z.string()),
  sessionId: z.string(),
});

export const ValueNumberResponseSchema = z.object({
  value: z.number(),
  sessionId: z.string(),
});

export const NoValueResponseSchema = z.object({
  sessionId: z.string(),
});
