import { KurentoEventType } from './kurento-event';
import {
  CertificateKeyType,
  DscpValue,
  MediaProfile,
  MediaType,
} from './core-types';

export type KurentoMethod =
  | 'ping'
  | 'create'
  | 'invoke'
  | 'release'
  | 'subscribe'
  | 'unsubscribe';

export type KurentoElements =
  | 'MediaPipeline'
  | 'WebRtcEndpoint'
  | 'PlayerEndpoint'
  | 'RecorderEndpoint'
  | 'Composite'
  | 'HubPort';

/*export type KurentoParams = {
  type?:
    | 'MediaPipeline'
    | 'WebRtcEndpoint'
    | 'PlayerEndpoint'
    | 'RecorderEndpoint'
    | 'Composite'
    | 'HubPort'
    | KurentoEventType;
  object?: string;
  operation?: string;
  subscription?: string;
  constructorParams?: {
    mediaPipeline?: string;
    hub?: string;
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
    latencyStats?: boolean;
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
};*/

export type KurentoCreateParams = {
  type: KurentoElements;
  constructorParams: {
    mediaPipeline?: string;
    hub?: string;
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
    latencyStats?: boolean;
  };
  properties: {};
};

export type KurentoInvokeParams = {
  object: string;
  operation: string;
  operationParams: {
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
};

export type KurentoReleaseParams = {
  object: string;
};

export type KurentoSubscribeParams = {
  type: KurentoEventType;
  object: string;
};

export type KurentoUnsubscribeParams = KurentoSubscribeParams & {
  subscription: string;
};
