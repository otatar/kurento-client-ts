import { z } from 'zod';

export interface WebRtcEndpointOptions {
  recvonly?: boolean;
  sendonly?: boolean;
  useDataChannels?: boolean;
  certificateKeyType?: CertificateKeyType;
  qosDscp?: DscpValue;
}

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

export type CertificateKeyType = 'RSA' | 'ECDSA';

export type DscpValue =
  | 'NO_DSCP'
  | 'NO_VALUE'
  | 'AUDIO_VERYLOW'
  | 'AUDIO_LOW'
  | 'AUDIO_MEDIUM'
  | 'AUDIO_HIGH'
  | 'VIDEO_VERYLOW'
  | 'VIDEO_LOW'
  | 'VIDEO_MEDIUM'
  | 'VIDEO_MEDIUM_THROUGHPUT'
  | 'VIDEO_HIGH'
  | 'VIDEO_HIGH_THROUGHPUT'
  | 'DATA_VERYLOW'
  | 'DATA_LOW'
  | 'DATA_MEDIUM'
  | 'DATA_HIGH'
  | 'CHROME_HIGH'
  | 'CHROME_MEDIUM'
  | 'CHROME_LOW'
  | 'CHROME_VERYLOW'
  | 'CS0'
  | 'CS1'
  | 'CS2'
  | 'CS3'
  | 'CS4'
  | 'CS5'
  | 'CS6'
  | 'CS7'
  | 'AF11'
  | 'AF12'
  | 'AF13'
  | 'AF21'
  | 'AF22'
  | 'AF23'
  | 'AF31'
  | 'AF32'
  | 'AF33'
  | 'AF41'
  | 'AF42'
  | 'AF43'
  | 'EF'
  | 'VOICEADMIT'
  | 'LE';
