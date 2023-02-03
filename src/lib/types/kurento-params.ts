import { KurentoEventType } from './kurento-event';
import {
  CertificateKeyType,
  DscpValue,
  MediaProfile,
  MediaType,
} from './core-types';

export type KurentoMethod =
  | 'ping'
  | 'connect'
  | 'create'
  | 'invoke'
  | 'describe'
  | 'release'
  | 'subscribe'
  | 'unsubscribe';

export type KurentoElements =
  | 'ServerManager'
  | 'MediaPipeline'
  | 'WebRtcEndpoint'
  | 'PlayerEndpoint'
  | 'RecorderEndpoint'
  | 'Composite'
  | 'DispatcherOneToMany'
  | 'Dispatcher'
  | 'HubPort';

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
    moduleName?: string;
    interval?: number;
    source?: string;
  };
};

export type KurentoReleaseParams = {
  object: string;
};

export type KurentoDescribeParams = KurentoReleaseParams;

export type KurentoSubscribeParams = {
  type: KurentoEventType;
  object: string;
};

export type KurentoUnsubscribeParams = KurentoSubscribeParams & {
  subscription: string;
};
