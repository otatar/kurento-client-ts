import { EventEmitter } from 'events';
import Rpc from '../rpc';
import { KurentoEvent, KurentoEventType } from '../types/kurento-event';
import {
  KurentoDescribeParams,
  KurentoInvokeParams,
  KurentoReleaseParams,
  KurentoSubscribeParams,
  KurentoUnsubscribeParams,
} from '../types/kurento-params';
import { Log, LogType } from '../logger';
import {
  createResponseSchema,
  DescribeResponseSchema,
  ElementConnectionsSchema,
  MediaType,
  NoValueResponseSchema,
  ValueStringResponseSchema,
} from '../types';

export default class BaseElement extends EventEmitter {
  protected rpc: Rpc;
  protected logger: LogType;
  constructor(protected objId: string) {
    super();
    this.rpc = Rpc.getInstance();
    this.logger = Log.getLogInstance();
  }

  public getObjectId() {
    return this.objId;
  }

  public async subscribe(event: KurentoEventType) {
    this.logger.info(`Subscribing for ${event} event on element ${this.objId}`);

    //Before request listen for this event from kms
    this.rpc.on(event, (event: KurentoEvent) => {
      if (event.object && event.object == this.objId) {
        //This event if for me, forward
        this.logger.info(`Received ${event.type} event`);
        this.emit(event.type, event);
      }
    });

    const params: KurentoSubscribeParams = {
      type: event,
      object: this.objId,
    };
    const res = await this.rpc.kurentoRequest(
      'subscribe',
      params,
      ValueStringResponseSchema
    );

    if (res) {
      return res.value;
    } else {
      return null;
    }
  }

  public async unsubscribe(subscription: string, event: KurentoEventType) {
    this.logger.info(
      `Unsubscribing for ${event} event on element ${this.objId}`
    );
    const params: KurentoUnsubscribeParams = {
      subscription: subscription,
      type: event,
      object: this.objId,
    };

    return await this.rpc.kurentoRequest(
      'unsubscribe',
      params,
      NoValueResponseSchema
    );
  }

  public async describe() {
    this.logger.info(`Sending describe for element ${this.objId}`);
    const params: KurentoDescribeParams = {
      object: this.objId,
    };
    const res = await this.rpc.kurentoRequest(
      'describe',
      params,
      DescribeResponseSchema
    );

    if (res) {
      return {
        hierarchy: res.hierarchy,
        qualifiedType: res.qualifiedType,
        type: res.type,
      };
    } else {
      return null;
    }
  }

  public async release() {
    this.logger.info(`Releasing media element: ${this.objId}`);
    const params: KurentoReleaseParams = {
      object: this.objId,
    };
    this.rpc.removeAllListeners();
    return await this.rpc.kurentoRequest(
      'release',
      params,
      NoValueResponseSchema
    );
  }

  public async getSourceConnections(mediaType: MediaType) {
    this.logger.info(
      `Getting source connections for medial element ${this.objId}`
    );
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'getSourceConnections',
      operationParams: {
        mediaType: mediaType,
      },
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      createResponseSchema(ElementConnectionsSchema)
    );
    return res?.value;
  }

  public async getSinkConnections(mediaType: MediaType) {
    this.logger.info(
      `Getting sink connections for medial element ${this.objId}`
    );
    const params: KurentoInvokeParams = {
      object: this.objId,
      operation: 'getSourceConnections',
      operationParams: {
        mediaType: mediaType,
      },
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      createResponseSchema(ElementConnectionsSchema)
    );

    return res?.value;
  }
}
