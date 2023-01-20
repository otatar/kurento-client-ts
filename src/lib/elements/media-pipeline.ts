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
    if (res && res.value && typeof res.value === 'string') {
      return new WebRtcEndpoint(res.value, res.sessionId);
    } else {
      return null;
    }
  }

  public async connect(source: WebRtcEndpoint, destination: WebRtcEndpoint) {
    this.logger.info(
      `Connecting element: ${source.getObjectId()} to element: ${destination.getObjectId()}`
    );
    const params: KurentoParams = {
      object: source.getObjectId(),
      operation: 'connect',
      operationParams: {
        sink: destination.getObjectId(),
      },
      sessionId: this.sessionId,
    };
    return await this.rpc.kurentoRequest('invoke', params);
  }

  public async disconnect(source: WebRtcEndpoint, destination: WebRtcEndpoint) {
    this.logger.info(
      `Connecting element: ${source.getObjectId()} to element: ${destination.getObjectId()}`
    );
    const params: KurentoParams = {
      object: source.getObjectId(),
      operation: 'disconnect',
      operationParams: {
        sink: destination.getObjectId(),
      },
      sessionId: this.sessionId,
    };
    return await this.rpc.kurentoRequest('invoke', params);
  }
}
