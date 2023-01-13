import { EventEmitter } from 'events';
import Rpc from '../rpc';
import { KurentoEvent } from '../types/kurento-event';
import { KurentoParams } from '../types/kurento-params';
import { Log, LogType } from '../logger';

export default class BaseElement extends EventEmitter {
  protected rpc: Rpc;
  protected logger: LogType;
  constructor(protected objId: string, protected sessionId?: string) {
    super();
    this.rpc = Rpc.getInstance();
    this.logger = Log.getLogInstance();

    this.rpc.on('IceCandidateFound', (event: KurentoEvent) => {
      if (event.object && event.object == this.objId) {
        //This event if for me, forward
        this.logger.info('Received IceCandidateFound event');
        this.emit('IceCandidateFound', event);
      }
    });
  }

  public getObjectId() {
    return this.objId;
  }

  public async release() {
    this.logger.info(`Releasing media element: ${this.objId}`);
    const params: KurentoParams = {
      object: this.objId,
      sessionId: this.sessionId,
    };
    return await this.rpc.kurentoRequest('release', params);
  }
}
