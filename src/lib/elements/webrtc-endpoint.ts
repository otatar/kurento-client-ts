import {
  CertificateKeyType,
  DscpValue,
  NoValueResponseSchema,
  ValueStringResponseSchema,
} from '../types';
import { KurentoInvokeParams } from '../types/kurento-params';
import BaseElement from './base-element';

export class WebRtcEndpoint extends BaseElement {
  recvonly: boolean;
  sendonly: boolean;
  useDataChannels: boolean;
  certificateKeyType: CertificateKeyType;
  qosDscp: DscpValue;
  constructor(
    objId: string,
    recvonly: boolean,
    sendonly: boolean,
    useDataChannels: boolean,
    certificateKeyType: CertificateKeyType,
    qosDscp: DscpValue
  ) {
    super(objId);
    this.recvonly = recvonly;
    this.sendonly = sendonly;
    this.useDataChannels = useDataChannels;
    this.certificateKeyType = certificateKeyType;
    this.qosDscp = qosDscp;
  }

  public getObjectId() {
    return this.objId;
  }

  public async sendLocalOffer(offer: string): Promise<string | null> {
    this.logger.info('Sending local SDP offer');
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'processOffer',
      operationParams: {
        offer: offer,
      },
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      ValueStringResponseSchema
    );
    this.logger.info('Receive remote SDP offer');
    if (res) {
      return res.value;
    } else {
      this.logger.error('Something is wrong with expected response!');
      return null;
    }
  }

  public async gatherCandidates() {
    this.logger.info('Sending gatherCandidates');
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'gatherCandidates',
      operationParams: {},
    };

    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      NoValueResponseSchema
    );
  }

  public async addIceCandidate(candidate: RTCIceCandidate) {
    this.logger.info('Sending local ice candidate');
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'addIceCandidate',
      operationParams: {
        candidate: {
          candidate: candidate.candidate,
          sdpMid: candidate.sdpMid ?? '',
          sdpMLineIndex: candidate.sdpMLineIndex,
        },
      },
    };
    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      NoValueResponseSchema
    );
  }

  public async createDataChannel(dataChannelOpts?: {
    label?: string;
    ordered?: boolean;
    maxPacketLifeTime?: number;
    maxRetransmits?: number;
    protocol?: string;
  }) {
    this.logger.info('Sending createDataChannel');
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'createDataChannel',
      operationParams: dataChannelOpts ? dataChannelOpts : {},
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      ValueStringResponseSchema
    );
    if (res) {
      this.logger.info(`Data Channel created, id ${res.value}`);
      return res.value;
    } else {
      this.logger.warn('Could not create Data Channel!');
      return null;
    }
  }

  public async closeDataChannel(channelId: string) {
    this.logger.info(`Closing data channel with id: ${channelId}`);
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'closeDataChannel',
      operationParams: {
        channelId: channelId,
      },
    };
    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      NoValueResponseSchema
    );
  }
}
