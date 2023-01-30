import { KurentoParams } from './lib/types/kurento-params';
import { MediaPipeline } from './lib/elements/media-pipeline';
import { Log, LogType } from './lib/logger';
import Rpc from './lib/rpc';
import { generateResponseSchema } from './lib/types';

export default class KurentoClient {
  private rpc: Rpc;
  logger: LogType;

  constructor(kmsUri: string, logLevel = 4) {
    this.logger = Log.getLogInstance({ minLevel: logLevel });
    this.rpc = Rpc.getInstance(kmsUri);
    this.logger.info('Kurento client created');
  }

  async ping() {
    this.logger.info('Ping request');
    return await this.rpc.kurentoRequest('ping', {}, generateResponseSchema());
  }

  async createMediaPipeline(latencyStats = true) {
    this.logger.info('Creating MediaPipeline');
    const params: KurentoParams = {
      type: 'MediaPipeline',
      constructorParams: {
        latencyStats,
      },
      properties: {},
    };
    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      generateResponseSchema()
    );
    if (res && res.value) {
      return new MediaPipeline(res.value, res.sessionId);
    } else {
      return null;
    }
  }

  close() {
    this.logger.info('Closing RPC connection!');
    this.rpc.close();
  }
}

export * from './lib/elements';
export * from './lib/types';
