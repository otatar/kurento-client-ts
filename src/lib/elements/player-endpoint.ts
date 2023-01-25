import { generateResponseSchema, KurentoParams } from '../types';
import BaseElement from './base-element';

export class PlayerEndpoint extends BaseElement {
  constructor(objId: string, sessionID?: string) {
    super(objId, sessionID);
  }

  public getObjectId() {
    return this.objId;
  }

  public async play() {
    this.logger.info('Sending play to player');
    const params: KurentoParams = {
      object: this.objId,
      operation: 'play',
      operationParams: {},
      sessionId: this.sessionId,
    };

    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      generateResponseSchema()
    );
  }
}
