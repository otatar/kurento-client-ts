import { z } from 'zod';

const kurentoEventType = [
  'IceCandidateFound',
  'IceGatheringDone',
  'IceComponentStateChanged',
  'DataChannelOpened',
  'DataChannelClosed',
  'NewCandidatePairSelected',
  'EndOfStream',
  'Recording',
  'Paused',
  'Stopped',
] as const;

const iceComponentState = [
  'DISCONNECTED',
  'GATHERING',
  'CONNECTING',
  'CONNECTED',
  'READY',
  'FAILED',
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
      candidatePair: z
        .object({
          streamId: z.string(),
          componentId: z.number(),
          localCandidate: z.string(),
          remoteCandidate: z.string(),
        })
        .optional(),
      streamId: z.string().optional(),
      componentId: z.number().optional(),
      state: z.enum(iceComponentState).optional(),
      channelId: z.number().optional(),
    })
  ),
});

export type KurentoEventType = (typeof kurentoEventType)[number];
export type KurentoEvent = z.infer<typeof KurentoEventSchema>;
