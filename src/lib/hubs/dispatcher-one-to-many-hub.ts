import { KurentoInvokeParams, NoValueResponseSchema } from '../types';
import BaseHub from './base-hub';
import { HubPort } from './hub-port';

export class DispatcherOneToMany extends BaseHub {
  private source: HubPort | null = null;
  constructor(objId: string) {
    super(objId);
  }

  getSource() {
    return this.source;
  }

  async setSource(hubPort: HubPort) {
    this.logger.info(`Setting source to: ${hubPort.getObjectId}`);
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'setSource',
      operationParams: {
        source: hubPort.getObjectId(),
      },
    };
    this.source = hubPort;
    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      NoValueResponseSchema
    );
  }

  async removeSource() {
    this.logger.info(`Removing source: ${this.source?.getObjectId()}`);
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'removeSource',
      operationParams: {},
    };
    this.source = null;
    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      NoValueResponseSchema
    );
  }
}
