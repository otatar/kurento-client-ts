import { generateResponseSchema, KurentoEventType } from '../types';
import { KurentoParams } from '../types/kurento-params';
import BaseElement from './base-element';

export class WebRtcEndpoint extends BaseElement {
  constructor(objId: string, sessionID?: string) {
    super(objId, sessionID);
  }

  public getObjectId() {
    return this.objId;
  }

  public async sendLocalOffer(offer: string): Promise<string | null> {
    this.logger.info('Sending local SDP offer');
    const params: KurentoParams = {
      object: this.objId,
      operation: 'processOffer',
      operationParams: {
        offer: offer,
      },
      sessionId: this.sessionId,
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      generateResponseSchema()
    );
    this.logger.info('Receive remote SDP offer');
    if (res?.value) {
      return res.value;
    } else {
      this.logger.error('Something is wrong with expected response!');
      return null;
    }
  }

  public async gatherCandidates() {
    this.logger.info('Sending gatherCandidates');
    const params: KurentoParams = {
      object: this.objId,
      operation: 'gatherCandidates',
      sessionId: this.sessionId,
    };

    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      generateResponseSchema()
    );
  }

  public async subscribe(event: KurentoEventType) {
    this.logger.info('Subscribing for IceCandidateFound event');
    const params: KurentoParams = {
      type: event,
      object: this.objId,
      sessionId: this.sessionId,
    };
    return await this.rpc.kurentoRequest(
      'subscribe',
      params,
      generateResponseSchema()
    );
  }

  public async addIceCandidate(candidate: RTCIceCandidate) {
    this.logger.info('Sending local ice candidate');
    const params: KurentoParams = {
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
      generateResponseSchema()
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
    const params: KurentoParams = {
      object: this.objId,
      operation: 'createDataChannel',
      operationParams: dataChannelOpts ? dataChannelOpts : {},
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      generateResponseSchema()
    );
    this.logger.info(`Data Channel created, id ${res?.value}`);
    return res?.value;
  }

  public async closeDataChannel(channelId: string) {
    this.logger.info(`Closing data channel with id: ${channelId}`);
    const params: KurentoParams = {
      object: this.objId,
      operation: 'closeDataChannel',
      operationParams: {
        channelId: channelId,
      },
    };
    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      generateResponseSchema()
    );
  }
}
