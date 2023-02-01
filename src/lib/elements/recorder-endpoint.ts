import { KurentoInvokeParams, NoValueResponseSchema } from '../types';
import BaseElement from './base-element';

export class RecorderEndpoint extends BaseElement {
  constructor(objId: string) {
    super(objId);
  }

  public getObjectId() {
    return this.objId;
  }

  public async record() {
    this.logger.info('Starting recording');
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'record',
      operationParams: {},
    };

    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      NoValueResponseSchema
    );
  }

  public async stop() {
    this.logger.info('Stop recording');
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'stop',
      operationParams: {},
    };

    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      NoValueResponseSchema
    );
  }
}
