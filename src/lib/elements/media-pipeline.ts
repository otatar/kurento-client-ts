import { KurentoParams } from '../types/kurento-params';
import BaseElement from './base-element';
import { WebRtcEndpoint } from '../elements/webrtc-endpoint';

export class MediaPipeline extends BaseElement {
  constructor(objId: string, sessionId?: string) {
    super(objId, sessionId);
  }

  public async createWebRtcEndpoint() {
    this.logger.info('Creating WebRtc Endpoint');
    const params: KurentoParams = {
      type: 'WebRtcEndpoint',
      constructorParams: {
        mediaPipeline: this.objId,
      },
      properties: {},
      sessionId: this.sessionId,
    };

    const res = await this.rpc.kurentoRequest('create', params);
    if (res && res.value) {
      return new WebRtcEndpoint(res.value, res.sessionId);
    } else {
      return null;
    }
  }
}
