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

export const ElementConnectionsSchema = z.array(ElementConnectionSchema);

export type ElementConnecton = z.infer<typeof ElementConnectionSchema>;

const mediaProfile = [
  'WEBM',
  'MKV',
  'MP4',
  'WEBM_VIDEO_ONLY',
  'WEBM_AUDIO_ONLY',
  'MKV_VIDEO_ONLY',
  'MKV_AUDIO_ONLY',
  'MP4_VIDEO_ONLY',
  'MP4_AUDIO_ONLY',
  'JPEG_VIDEO_ONLY',
  'KURENTO_SPLIT_RECORDER',
  'FLV',
] as const;

export type MediaProfile = (typeof mediaProfile)[number];
