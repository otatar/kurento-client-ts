import {
  CertificateKeyType,
  DscpValue,
  KurentoParams,
} from '../types/kurento-params';
import BaseElement from './base-element';
import { WebRtcEndpoint } from '../elements/webrtc-endpoint';
import { generateResponseSchema, MediaProfile } from '../types';
import { PlayerEndpoint } from './player-endpoint';
import { RecorderEndpoint } from './recorder-endpoint';
import { HubPort } from './hub-port';

export class MediaPipeline extends BaseElement {
  constructor(objId: string, sessionId?: string) {
    super(objId, sessionId);
  }

  public async createWebRtcEndpoint(
    recvonly = false,
    sendonly = false,
    useDataChannels = false,
    certificateKeyType: CertificateKeyType = 'RSA',
    qosDscp: DscpValue = 'NO_VALUE'
  ) {
    this.logger.info('Creating WebRtc Endpoint');
    const params: KurentoParams = {
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
      sessionId: this.sessionId,
    };

    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      generateResponseSchema()
    );
    if (res && res.value) {
      return new WebRtcEndpoint(
        res.value,
        recvonly,
        sendonly,
        useDataChannels,
        certificateKeyType,
        qosDscp,
        res.sessionId
      );
    } else {
      this.logger.error('Could not create WebRtc Endpoint!');
      return null;
    }
  }

  public async createPlayerEndpoint(
    uri: string,
    useEncodeMedia = false,
    networkCache = 2000
  ) {
    this.logger.info('Creating Player Endpoint');
    const params: KurentoParams = {
      type: 'PlayerEndpoint',
      constructorParams: {
        mediaPipeline: this.objId,
        uri: uri,
        useEnodedMadia: useEncodeMedia,
        networkCache: networkCache,
      },
      properties: {},
      sessionId: this.sessionId,
    };

    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      generateResponseSchema()
    );
    if (res && res.value) {
      return new PlayerEndpoint(res.value, res.sessionId);
    } else {
      this.logger.error('Could not create Player Endpoint!');
      return null;
    }
  }

  public async createRecorderEndpoint(
    uri: string,
    mediaProfile: MediaProfile = 'WEBM',
    stopOnEndOfStream = true
  ) {
    this.logger.info('Creating Recorder Endpoint');
    const params: KurentoParams = {
      type: 'RecorderEndpoint',
      constructorParams: {
        mediaPipeline: this.objId,
        uri: uri,
        mediaProfile: mediaProfile,
        stopOnEndOfStream: stopOnEndOfStream,
      },
      properties: {},
      sessionId: this.sessionId,
    };

    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      generateResponseSchema()
    );
    if (res && res.value) {
      return new RecorderEndpoint(res.value, res.sessionId);
    } else {
      this.logger.error('Could not create Recorder Endpoint!');
      return null;
    }
  }

  public async createComposite() {
    this.logger.info('Creating Composite Hub');
    const params: KurentoParams = {
      type: 'Composite',
      constructorParams: {
        mediaPipeline: this.objId,
      },
      properties: {},
      sessionId: this.sessionId,
    };

    const res = await this.rpc.kurentoRequest(
      'create',
      params,
      generateResponseSchema()
    );
    if (res && res.value) {
      return new RecorderEndpoint(res.value, res.sessionId);
    } else {
      this.logger.error('Could not create Composite Hub!');
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
    const params: KurentoParams = {
      object: source.getObjectId(),
      operation: 'connect',
      operationParams: {
        sink: destination.getObjectId(),
      },
      sessionId: this.sessionId,
    };
    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      generateResponseSchema()
    );
  }

  public async disconnect(source: WebRtcEndpoint, destination: WebRtcEndpoint) {
    this.logger.info(
      `Connecting element: ${source.getObjectId()} to element: ${destination.getObjectId()}`
    );
    const params: KurentoParams = {
      object: source.getObjectId(),
      operation: 'disconnect',
      operationParams: {
        sink: destination.getObjectId(),
      },
      sessionId: this.sessionId,
    };
    return await this.rpc.kurentoRequest(
      'invoke',
      params,
      generateResponseSchema()
    );
  }
}
