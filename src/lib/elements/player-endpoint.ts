import { KurentoInvokeParams, NoValueResponseSchema } from '../types';
import BaseElement from './base-element';

export class PlayerEndpoint extends BaseElement {
  constructor(objId: string) {
    super(objId);
  }

  public async play() {
    this.logger.info('Sending play to player');
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'play',
      operationParams: {},
    };

    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      NoValueResponseSchema
    );
  }
}
