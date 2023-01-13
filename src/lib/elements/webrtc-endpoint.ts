import { KurentoParams } from '../types/kurento-params';
import BaseElement from './base-element';

export class WebRtcEndpoint extends BaseElement {
  constructor(objId: string, sessionID?: string) {
    super(objId, sessionID);
  }

  public getObjectId() {
    return this.objId;
  }

  public async connect<T extends BaseElement>(element: T) {
    this.logger.info(`Connecting ${this.objId} to ${element.getObjectId()}`);
    const params: KurentoParams = {
      object: this.objId,
      operation: 'connect',
      operationParams: {
        sink: element.getObjectId(),
      },
      sessionId: this.sessionId,
    };
    return await this.rpc.kurentoRequest('invoke', params);
  }

  public async sendLocalOffer(offer: string) {
    this.logger.info('Sending local SDP offer');
    const params: KurentoParams = {
      object: this.objId,
      operation: 'processOffer',
      operationParams: {
        offer: offer,
      },
      sessionId: this.sessionId,
    };
    const res = await this.rpc.kurentoRequest('invoke', params);
    this.logger.info('Receive remote SDP offer');
    return res?.value;
  }

  public async gatherCandidates() {
    this.logger.info('Sending gatherCandidates');
    const params: KurentoParams = {
      object: this.objId,
      operation: 'gatherCandidates',
      sessionId: this.sessionId,
    };

    return await this.rpc.kurentoRequest('invoke', params);
  }

  public async subscribeForIceCandidateFound() {
    this.logger.info('Subscribing for IceCandidateFound event');
    const params: KurentoParams = {
      type: 'IceCandidateFound',
      object: this.objId,
      sessionId: this.sessionId,
    };
    return await this.rpc.kurentoRequest('subscribe', params);
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
    return await this.rpc.kurentoRequest('invoke', params);
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
    const res = await this.rpc.kurentoRequest('invoke', params);
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
    return await this.rpc.kurentoRequest('invoke', params);
  }
}
