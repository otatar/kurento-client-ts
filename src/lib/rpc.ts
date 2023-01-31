import { EventEmitter } from 'events';
import WebSocket from 'isomorphic-ws';
import {
  JSONRPCClient,
  JSONRPCServer,
  JSONRPCServerAndClient,
} from 'json-rpc-2.0';
import { KurentoError, KurentoErrorSchema } from './types/kurento-error';
import { KurentoMethod, KurentoParams } from './types/kurento-params';
import { KurentoEventSchema } from './types/kurento-event';
import { Log, LogType } from './logger';
import { z } from 'zod';

export default class Rpc extends EventEmitter {
  private sessionId: string | undefined;
  private logger: LogType;
  private static instance: Rpc;
  private ws: WebSocket;
  private rpc: JSONRPCServerAndClient<void>;

  private constructor(wsUri: string) {
    super();
    this.logger = Log.getLogInstance();
    this.ws = new WebSocket(wsUri);

    this.ws.onclose = () => {
      this.logger.info('Web Socket is closed!');
      this.rpc.rejectAllPendingRequests('Web Socket is closed');
    };

    this.ws.onmessage = (event: any) =>
      this.rpc.receiveAndSend(JSON.parse(event.data.toString()));

    //JSON-RPC
    const rpcServer = new JSONRPCServer();
    const rpcClient = new JSONRPCClient(async (jsonRPCRequest) => {
      try {
        await this.waitForOpenSocket();
        this.ws.send(JSON.stringify(jsonRPCRequest));
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    });

    this.rpc = new JSONRPCServerAndClient(rpcServer, rpcClient, {});

    this.rpc.addMethod('onEvent', ({ value }: { value: unknown }) => {
      this.logger.info(`Received onEvent request from kms`);
      this.logger.debug(`Event: ${JSON.stringify(value)}`);
      const parseResult = KurentoEventSchema.safeParse(value);
      if (!parseResult.success) {
        this.logger.debug(`Error: ${parseResult.error}`);
        this.logger.error("Can't parse incoming event");
      } else {
        const kurentoEvent = parseResult.data;
        this.logger.info(`Event Type: ${kurentoEvent.type}`);
        this.emit(kurentoEvent.type, kurentoEvent);
      }
    });
  }

  static getInstance(kmsUri?: string) {
    if (!Rpc.instance && kmsUri) {
      Rpc.instance = new Rpc(kmsUri);
    }
    return Rpc.instance;
  }

  setSessionid(sessionId: string) {
    this.sessionId = sessionId;
  }

  async kurentoRequest<T>(
    method: KurentoMethod,
    params: KurentoParams,
    responseSchema: z.Schema<T>
  ): Promise<T | null> {
    try {
      this.logger.debug(
        `Sending request method: ${method} and params: ${JSON.stringify(
          params
        )}`
      );
      //Inject sessionId
      if (this.sessionId) params = { ...params, sessionId: this.sessionId };

      //Send request and wait for response
      const res = await this.rpc.request(method, params);

      //Check result
      const parseResult = responseSchema.safeParse(res);
      if (parseResult.success) {
        const response = parseResult.data;
        this.logger.debug(`Received response: ${JSON.stringify(response)}`);
        return response;
      } else {
        this.logger.warn(`Can't parse response: ${res}`);
        return null;
      }
    } catch (e: any) {
      const parseResult = KurentoErrorSchema.safeParse(e);
      if (parseResult.success) {
        const kurentoError: KurentoError = parseResult.data;
        this.logger.warn(
          `Received error with code: ${kurentoError.code} and message: ${kurentoError.message}!`
        );
      } else {
        this.logger.error(`Received unknown error: ${JSON.stringify(e)}`);
      }
      return null;
    }
  }

  close() {
    this.logger.info('Closing websocket connection!');
    this.ws.close();
  }

  private async waitForOpenSocket() {
    this.logger.debug('Waiting for open websocket');
    return new Promise((resolve: (value: void) => void) => {
      if (this.ws.readyState !== this.ws.OPEN) {
        this.ws.addEventListener('open', (_: any) => {
          this.logger.info('Web Socket is opened!');
          resolve();
        });
      } else {
        this.logger.debug('WebSocket is allready opened!');
        resolve();
      }
    });
  }
}
