import { generateResponseSchema, KurentoParams } from '../types';
import BaseElement from './base-element';

export class RecorderEndpoint extends BaseElement {
  constructor(objId: string, sessionID?: string) {
    super(objId, sessionID);
  }

  public getObjectId() {
    return this.objId;
  }

  public async record() {
    this.logger.info('Starting recording');
    const params: KurentoParams = {
      object: this.objId,
      operation: 'record',
      operationParams: {},
      sessionId: this.sessionId,
    };

    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      generateResponseSchema()
    );
  }

  public async stop() {
    this.logger.info('Stop recording');
    const params: KurentoParams = {
      object: this.objId,
      operation: 'stop',
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
