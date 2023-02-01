import { EventEmitter } from 'events';
import Rpc from '../rpc';
import { KurentoEvent, KurentoEventType } from '../types/kurento-event';
import {
  KurentoInvokeParams,
  KurentoReleaseParams,
  KurentoSubscribeParams,
  KurentoUnsubscribeParams,
} from '../types/kurento-params';
import { Log, LogType } from '../logger';
import {
  createResponseSchema,
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

    /*this.rpc.on('IceCandidateFound', (event: KurentoEvent) => {
      if (event.object && event.object == this.objId) {
        //This event if for me, forward
        this.logger.info('Received IceCandidateFound event');
        this.emit('IceCandidateFound', event);
      }
    });

    this.rpc.on('IceGatheringDone', (event: KurentoEvent) => {
      if (event.object && event.object == this.objId) {
        //This event if for me, forward
        this.logger.info('Received IceGatheringDone event');
        this.emit('IceGatheringDone', event);
      }
    });

    this.rpc.on('IceComponentStateChanged', (event: KurentoEvent) => {
      if (event.object && event.object == this.objId) {
        //This event if for me, forward
        this.logger.info('Received IceComponentStateChanged event');
        this.emit('IceComponentStateChanged', event);
      }
    });

    this.rpc.on('DataChannelOpened', (event: KurentoEvent) => {
      if (event.object && event.object == this.objId) {
        //This event if for me, forward
        this.logger.info('Received DataChannelOpened event');
        this.emit('DataChannelOpened', event);
      }
    });

    this.rpc.on('DataChannelClosed', (event: KurentoEvent) => {
      if (event.object && event.object == this.objId) {
        //This event if for me, forward
        this.logger.info('Received DataChannelClosed event');
        this.emit('DataChannelClosed', event);
      }
    });

    this.rpc.on('NewCandidatePairSelected', (event: KurentoEvent) => {
      if (event.object && event.object == this.objId) {
        //This event if for me, forward
        this.logger.info('Received NewCandidatePairSelected event');
        this.emit('NewCandidatePairSelected', event);
      }
    });

    this.rpc.on('EndOfStream', (event: KurentoEvent) => {
      if (event.object && event.object == this.objId) {
        //This event if for me, forward
        this.logger.info('Received EndOfStream event');
        this.emit('EndOfStream', event);
      }
    });

    this.rpc.on('Recording', (event: KurentoEvent) => {
      if (event.object && event.object == this.objId) {
        //This event if for me, forward
        this.logger.info('Received Recording event');
        this.emit('Recording', event);
      }
    });

    this.rpc.on('Paused', (event: KurentoEvent) => {
      if (event.object && event.object == this.objId) {
        //This event if for me, forward
        this.logger.info('Received Paused event');
        this.emit('Paused', event);
      }
    });

    this.rpc.on('Stopped', (event: KurentoEvent) => {
      if (event.object && event.object == this.objId) {
        //This event if for me, forward
        this.logger.info('Received Stopped event');
        this.emit('Stopped', event);
      }
    });*/
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
