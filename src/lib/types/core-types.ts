import { z } from 'zod';

const mediaType = ['AUDIO', 'VIDEO', 'DATA'] as const;
export type MediaType = (typeof mediaType)[number];

export interface MediaObject {
  mediaPipeline: MediaObject;
  parent: MediaObject;
  children: MediaObject[];
  name: string;
  sendTagsInEvents: boolean;
  creationTime: number;
}

export const MediaObjectSchema: z.ZodType<MediaObject> = z.lazy(() =>
  z.object({
    mediaPipeline: MediaObjectSchema,
    parent: MediaObjectSchema,
    children: z.array(MediaObjectSchema),
    name: z.string(),
    sendTagsInEvents: z.boolean(),
    creationTime: z.number(),
  })
);

export const ElementConnectionSchema = z.object({
  source: z.string(),
  sink: z.string(),
  type: z.enum(mediaType),
  sourceDescription: z.string().nullable(),
  sinkDescription: z.string().nullable(),
});

export type ElementConnecton = z.infer<typeof ElementConnectionSchema>;

export function isElementConnection(obj: unknown): obj is ElementConnecton {
  return obj !== null && typeof obj === 'object';
}
