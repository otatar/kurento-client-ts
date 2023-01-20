import { z } from 'zod';

const kurentoEventType = [
  'IceCandidateFound',
  'IceGatheringDone',
  'IceComponentStateChanged',
  'DataChannelOpened',
  'DataChannelClosed',
  'NewCandidatePairSelected',
] as const;

export const KurentoEventSchema = z.object({
  type: z.enum(kurentoEventType),
  object: z.string(),
  data: z.optional(
    z.object({
      candidate: z.optional(
        z.object({
          candidate: z.string(),
          sdpMid: z.string(),
          sdpMLineIndex: z.number(),
        })
      ),
    })
  ),
});

export type KurentoEventType = (typeof kurentoEventType)[number];
export type KurentoEvent = z.infer<typeof KurentoEventSchema>;
