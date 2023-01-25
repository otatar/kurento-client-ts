import { KurentoEventType } from './kurento-event';
import { MediaProfile, MediaType } from './core-types';

export type KurentoMethod =
  | 'ping'
  | 'create'
  | 'invoke'
  | 'release'
  | 'subscribe'
  | 'unsubscribe';

export type KurentoParams = {
  type?:
    | 'MediaPipeline'
    | 'WebRtcEndpoint'
    | 'PlayerEndpoint'
    | 'RecorderEndpoint'
    | KurentoEventType;
  object?: string;
  operation?: string;
  constructorParams?: {
    mediaPipeline?: string;
    recvonly?: boolean;
    sendonly?: boolean;
    useDataChannels?: boolean;
    certificateKeyType?: CertificateKeyType;
    qosDscp?: DscpValue;
    uri?: string;
    useEnodedMadia?: boolean;
    networkCache?: number;
    mediaProfile?: MediaProfile;
    stopOnEndOfStream?: boolean;
  };
  operationParams?: {
    offer?: string;
    sink?: string;
    candidate?: {
      candidate: string;
      sdpMid: string | null;
      sdpMLineIndex: number | null;
    };
    label?: string;
    ordered?: boolean;
    maxPacketLifeTime?: number;
    maxRetransmits?: number;
    protocol?: string;
    channelId?: string;
    mediaType?: MediaType;
  };
  properties?: any;
  sessionId?: string;
};

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
