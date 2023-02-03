import {
  KurentoCreateParams,
  KurentoInvokeParams,
} from '../types/kurento-params';
import BaseElement from './base-element';
import { WebRtcEndpoint } from '../elements/webrtc-endpoint';
import {
  NoValueResponseSchema,
  PlayerEndpointOptions,
  RecorderEndpointOptions,
  ValueStringResponseSchema,
  WebRtcEndpointOptions,
} from '../types';
import { PlayerEndpoint } from './player-endpoint';
import { RecorderEndpoint } from './recorder-endpoint';
import { HubPort } from '../hubs/hub-port';
import { CompositeHub } from '../hubs/composite-hub';
import { DispatcherOneToMany } from '../hubs/dispatcher-one-to-many-hub';
import { Dispatcher } from '../hubs';

export class MediaPipeline extends BaseElement {
  constructor(objId: string) {
    super(objId);
  }

  public async createWebRtcEndpoint(
    opts: WebRtcEndpointOptions = {
      recvonly: false,
      sendonly: false,
      useDataChannels: false,
      certificateKeyType: 'RSA',
      qosDscp: 'NO_VALUE',
    }
  ) {
    this.logger.info('Creating WebRtc Endpoint');
    const { recvonly, sendonly, useDataChannels, certificateKeyType, qosDscp } =
      opts;
    const params: KurentoCreateParams = {
      type: 'WebRtcEndpoint',
      constructorParams: {
        mediaPipeline: this.objId,
        recvonly,
        sendonly,
        useDataChannels,
        certificateKeyType,
        qosDscp,
      },
      properties: {},
    };

    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      ValueStringResponseSchema
    );
    if (res) {
      return new WebRtcEndpoint(
        res.value,
        recvonly!,
        sendonly!,
        useDataChannels!,
        certificateKeyType!,
        qosDscp!
      );
    } else {
      this.logger.error('Could not create WebRtc Endpoint!');
      return null;
    }
  }

  public async createPlayerEndpoint(opts: PlayerEndpointOptions) {
    this.logger.info('Creating Player Endpoint');
    const params: KurentoCreateParams = {
      type: 'PlayerEndpoint',
      constructorParams: {
        mediaPipeline: this.objId,
        uri: opts.uri,
        useEnodedMadia: opts.useEncodeMedia ?? false,
        networkCache: opts.networkCache ?? 2000,
      },
      properties: {},
    };

    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      ValueStringResponseSchema
    );
    if (res) {
      return new PlayerEndpoint(res.value);
    } else {
      this.logger.error('Could not create Player Endpoint!');
      return null;
    }
  }

  public async createRecorderEndpoint(opts: RecorderEndpointOptions) {
    this.logger.info('Creating Recorder Endpoint');
    const params: KurentoCreateParams = {
      type: 'RecorderEndpoint',
      constructorParams: {
        mediaPipeline: this.objId,
        uri: opts.uri,
        mediaProfile: opts.mediaProfile ?? 'WEBM',
        stopOnEndOfStream: opts.stopOnEndOfStream ?? true,
      },
      properties: {},
    };

    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      ValueStringResponseSchema
    );
    if (res) {
      return new RecorderEndpoint(res.value);
    } else {
      this.logger.error('Could not create Recorder Endpoint!');
      return null;
    }
  }

  public async createComposite() {
    this.logger.info('Creating Composite Hub');
    const params: KurentoCreateParams = {
      type: 'Composite',
      constructorParams: {
        mediaPipeline: this.objId,
      },
      properties: {},
    };

    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      ValueStringResponseSchema
    );
    if (res) {
      return new CompositeHub(res.value);
    } else {
      this.logger.error('Could not create Composite Hub!');
      return null;
    }
  }

  public async createDispatcher() {
    this.logger.info('Creating Dispatcher Hub');
    const params: KurentoCreateParams = {
      type: 'Dispatcher',
      constructorParams: {
        mediaPipeline: this.objId,
      },
      properties: {},
    };

    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      ValueStringResponseSchema
    );
    if (res) {
      return new Dispatcher(res.value);
    } else {
      this.logger.error('Could not create Dispatcher Hub!');
      return null;
    }
  }

  public async createDispatcherOneToMany() {
    this.logger.info('Creating DispatcherOneToMany Hub');
    const params: KurentoCreateParams = {
      type: 'DispatcherOneToMany',
      constructorParams: {
        mediaPipeline: this.objId,
      },
      properties: {},
    };

    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      ValueStringResponseSchema
    );
    if (res) {
      return new DispatcherOneToMany(res.value);
    } else {
      this.logger.error('Could not create DispatcherOneToMany Hub!');
      return null;
    }
  }

  public async connect(
    source: WebRtcEndpoint | PlayerEndpoint | HubPort,
    destination: WebRtcEndpoint | RecorderEndpoint | HubPort
  ) {
    this.logger.info(
      `Connecting element: ${source.getObjectId()} to element: ${destination.getObjectId()}`
    );
    const params: KurentoInvokeParams = {
      object: source.getObjectId(),
      operation: 'connect',
      operationParams: {
        sink: destination.getObjectId(),
      },
    };
    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      NoValueResponseSchema
    );
  }

  public async disconnect(source: WebRtcEndpoint, destination: WebRtcEndpoint) {
    this.logger.info(
      `Connecting element: ${source.getObjectId()} to element: ${destination.getObjectId()}`
    );
    const params: KurentoInvokeParams = {
      object: source.getObjectId(),
      operation: 'disconnect',
      operationParams: {
        sink: destination.getObjectId(),
      },
    };
    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      NoValueResponseSchema
    );
  }
}
