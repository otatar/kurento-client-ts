import { KurentoInvokeParams, NoValueResponseSchema } from '../types';
import BaseHub from './base-hub';
import { HubPort } from './hub-port';

export class Dispatcher extends BaseHub {
  private source: HubPort | null = null;
  private sink: HubPort | null = null;

  constructor(objId: string) {
    super(objId);
  }

  getSource() {
    return this.source;
  }

  getSink() {
    return this.sink;
  }

  async connect(source: HubPort, sink: HubPort) {
    this.logger.info(
      `Connecting HubPort ${source.getObjectId()} to HubPort: ${sink.getObjectId()}`
    );
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'setSource',
      operationParams: {
        source: source.getObjectId(),
        sink: sink.getObjectId(),
      },
    };
    this.source = source;
    this.sink = sink;
    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      NoValueResponseSchema
    );
  }
}
