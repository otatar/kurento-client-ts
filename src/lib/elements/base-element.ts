import { EventEmitter } from 'events';
import Rpc from '../rpc';
import { KurentoEvent } from '../types/kurento-event';
import { KurentoParams } from '../types/kurento-params';
import { Log, LogType } from '../logger';
import {
  ElementConnectionsSchema,
  generateResponseSchema,
  MediaType,
} from '../types';

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
    return await this.rpc.kurentoRequest(
      'release',
      params,
      generateResponseSchema()
    );
  }

  public async getSourceConnections(mediaType: MediaType) {
    this.logger.info(
      `Getting source connections for medial element ${this.objId}`
    );
    const params: KurentoParams = {
      object: this.objId,
      sessionId: this.sessionId,
      operation: 'getSourceConnections',
      operationParams: {
        mediaType: mediaType,
      },
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      generateResponseSchema(ElementConnectionsSchema)
    );
    return res?.value;
  }

  public async getSinkConnections(mediaType: MediaType) {
    this.logger.info(
      `Getting sink connections for medial element ${this.objId}`
    );
    const params: KurentoParams = {
      object: this.objId,
      sessionId: this.sessionId,
      operation: 'getSourceConnections',
      operationParams: {
        mediaType: mediaType,
      },
    };
    const res = await this.rpc.kurentoRequest(
      'invoke',
      params,
      generateResponseSchema(ElementConnectionsSchema)
    );

    return res?.value;
  }
}