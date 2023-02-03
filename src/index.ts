import {
  KurentoCreateParams,
  KurentoInvokeParams,
} from './lib/types/kurento-params';
import { MediaPipeline } from './lib/elements/media-pipeline';
import { Log, LogType } from './lib/logger';
import Rpc from './lib/rpc';
import {
  createResponseSchema,
  PingResponseSchema,
  ServerInfoSchema,
  ValueNumberResponseSchema,
  ValueStringArrayResponseSchema,
  ValueStringResponseSchema,
} from './lib/types';

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
    return await this.rpc.kurentoRequest('ping', {}, PingResponseSchema);
  }

  async createMediaPipeline(latencyStats = true) {
    this.logger.info('Creating MediaPipeline');
    const params: KurentoCreateParams = {
      type: 'MediaPipeline',
      constructorParams: {
        latencyStats,
      },
      properties: {},
    };
    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      ValueStringResponseSchema
    );
    if (res) {
      if (res.sessionId) this.rpc.setSessionid(res.sessionId);
      return new MediaPipeline(res.value);
    } else {
      return null;
    }
  }

  async getPipelines() {
    this.logger.info('Sending getPipelines to kms');
    const params: KurentoInvokeParams = {
      object: 'manager_ServerManager',
      operation: 'getPipelines',
      operationParams: {},
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      ValueStringArrayResponseSchema
    );

    if (res) {
      return res.value;
    } else {
      return null;
    }
  }

  async getServerInfo() {
    this.logger.info('Sending getKmd to kms');
    const params: KurentoInvokeParams = {
      object: 'manager_ServerManager',
      operation: 'getInfo',
      operationParams: {},
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      createResponseSchema(ServerInfoSchema)
    );

    if (res) {
      return res.value;
    } else {
      return null;
    }
  }

  async getKmd(moduleName: string) {
    this.logger.info('Sending getKmd to kms');
    const params: KurentoInvokeParams = {
      object: 'manager_ServerManager',
      operation: 'getKmd',
      operationParams: {
        moduleName,
      },
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      ValueStringResponseSchema
    );

    if (res) {
      return res.value;
    } else {
      return null;
    }
  }

  async getCpuCount() {
    this.logger.info('Sending getCpuCount to kms');
    const params: KurentoInvokeParams = {
      object: 'manager_ServerManager',
      operation: 'getCpuCount',
      operationParams: {},
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      ValueNumberResponseSchema
    );

    if (res) {
      return res.value;
    } else {
      return null;
    }
  }

  async getUsedCpu(interval = 1000) {
    const validatedInterval =
      interval < 1000 ? 1000 : interval > 10000 ? 10000 : interval;
    this.logger.info(`Sending getUsedCpu for ${validatedInterval} to kms`);
    const params: KurentoInvokeParams = {
      object: 'manager_ServerManager',
      operation: 'getUsedCpu',
      operationParams: {
        interval: validatedInterval,
      },
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      ValueNumberResponseSchema
    );

    if (res) {
      return res.value;
    } else {
      return null;
    }
  }

  async getUsedMemory() {
    this.logger.info('Sending getUserMemory to kms');
    const params: KurentoInvokeParams = {
      object: 'manager_ServerManager',
      operation: 'getUsedMemory',
      operationParams: {},
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      ValueNumberResponseSchema
    );

    if (res) {
      return res.value;
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
