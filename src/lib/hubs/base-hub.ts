import { Log, LogType } from '../logger';
import Rpc from '../rpc';
import {
  KurentoCreateParams,
  KurentoReleaseParams,
  NoValueResponseSchema,
  ValueStringResponseSchema,
} from '../types';
import { HubPort } from './hub-port';

export default class BaseHub {
  protected rpc: Rpc;
  protected logger: LogType;
  constructor(protected objId: string) {
    this.rpc = Rpc.getInstance();
    this.logger = Log.getLogInstance();
  }

  public getObjectId() {
    return this.objId;
  }

  public async createHubPort() {
    this.logger.info('Creating Hub Port');
    const params: KurentoCreateParams = {
      type: 'HubPort',
      constructorParams: {
        hub: this.objId,
      },
      properties: {},
    };

    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      ValueStringResponseSchema
    );

    if (res) {
      return new HubPort(res.value, this.objId);
    } else {
      this.logger.error('Could not create Hub Port!');
      return null;
    }
  }

  public async release() {
    this.logger.info(`Releasing hub element: ${this.objId}`);
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
