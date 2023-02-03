import { Log, LogType } from '../logger';
import Rpc from '../rpc';
import { KurentoReleaseParams, NoValueResponseSchema } from '../types';

export class HubPort {
  protected rpc: Rpc;
  protected logger: LogType;
  constructor(private objId: string, private hubId: string) {
    this.rpc = Rpc.getInstance();
    this.logger = Log.getLogInstance();
  }

  public getObjectId() {
    return this.objId;
  }

  public getHubId() {
    return this.hubId;
  }

  public async release() {
    this.logger.info(`Releasing hub port: ${this.objId}`);
    const params: KurentoReleaseParams = {
      object: this.objId,
    };
    return await this.rpc.kurentoRequest(
      'release',
      params,
      NoValueResponseSchema
    );
  }
}
