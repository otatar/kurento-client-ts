import { KurentoParams } from './lib/types/kurento-params';
import { MediaPipeline } from './lib/elements/media-pipeline';
import { Log, LogType } from './lib/logger';
import Rpc from './lib/rpc';

export default class KurentoClient {
  private rpc: Rpc;
  logger: LogType;

  constructor(kmsUri: string) {
    this.rpc = Rpc.getInstance(kmsUri);
    this.logger = Log.getLogInstance();
    this.logger.info('Kurento client created');
  }

  async ping() {
    this.logger.info('Ping request');
    return await this.rpc.kurentoRequest('ping', {});
  }

  async createMediaPipeline() {
    this.logger.info('Creating MediaPipeline');
    const params: KurentoParams = {
      type: 'MediaPipeline',
      constructorParams: {},
      properties: {},
    };
    const res = await this.rpc.kurentoRequest('create', params);
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

  /*async createPipeline() {
    const params = {
      type: "MediaPipeline",
      constructorParams: {},
      properties: {},
    };
    const res = await this.rpc.request("create", params);
    console.log(res);
    this.sessionId = res.sessionId;
    return res.value;
  }

  async createWebRTCEdnpoint(pipeline: string) {
    const params = {
      type: "WebRtcEndpoint",
      constructorParams: {
        mediaPipeline: pipeline,
      },
      properties: {},
      sessionId: this.sessionId,
    };
    try {
      const res = await this.rpc.request("create", params);
      console.log(res);
      return res.value;
    } catch (e) {
      if (e instanceof Error) {
        console.log("Error: " + e.message);
      }
    }
  }

  async createPlayerEndpoint(pipeline: string, uri: string) {
    const params = {
      type: "PlayerEndpoint",
      constructorParams: {
        mediaPipeline: pipeline,
        uri: uri,
      },
      properties: {},
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("create", params);
    console.log(res);
    return res.value;
  }

  async createRecorderEndpoint(pipeline: string, uri: string) {
    const params = {
      type: "RecorderEndpoint",
      constructorParams: {
        mediaPipeline: pipeline,
        uri: uri,
      },
      properties: {},
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("create", params);
    console.log(res);
    return res.value;
  }

  async recorderRecord(recorder: string) {
    const params = {
      object: recorder,
      operation: "record",
      operationParams: {},
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("invoke", params);
    console.log(res);
  }

  async recorderStop(recorder: string) {
    const params = {
      object: recorder,
      operation: "stopAndWait",
      operationParams: {},
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("invoke", params);
    console.log(res);
  }

  async createComposite(pipeline: string) {
    const params = {
      type: "Composite",
      constructorParams: {
        mediaPipeline: pipeline,
      },
      properties: {},
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("create", params);
    console.log(res);
    return res.value;
  }

  async createHubPort(hub: string) {
    const params = {
      type: "HubPort",
      constructorParams: {
        hub: hub,
      },
      properties: {},
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("create", params);
    console.log(res);
    return res.value;
  }

  async createLoopback(webRtcEnd: string) {
    const params = {
      object: webRtcEnd,
      operation: "connect",
      operationParams: {
        sink: webRtcEnd,
      },
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("invoke", params);
    console.log(res);
  }

  async connect(source: string, sink: string) {
    const params = {
      object: source,
      operation: "connect",
      operationParams: {
        sink: sink,
      },
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("invoke", params);
    console.log(res);
  }

  async disconnect(source: string, sink: string) {
    const params = {
      object: source,
      operation: "disconnect",
      operationParams: {
        sink: sink,
      },
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("invoke", params);
    console.log(res);
  }

  async playerPlay(player: string) {
    const params = {
      object: player,
      operation: "play",
      operationParams: {},
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("invoke", params);
    console.log(res);
  }

  async sendLocalIceCandidate(webRtcEnd: string, candidate: RTCIceCandidate) {
    const params = {
      object: webRtcEnd,
      operation: "addIceCandidate",
      operationParams: {
        candidate: {
          candidate: candidate.candidate,
          sdpMid: candidate.sdpMid,
          sdpMLineIndex: candidate.sdpMLineIndex,
        },
      },
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("invoke", params);
    console.log(res);
  }

  async sendLocalSdp(webRtcEnd: string, localSdp: string) {
    const params = {
      object: webRtcEnd,
      operation: "processOffer",
      operationParams: {
        offer: localSdp,
      },
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("invoke", params);
    console.log(res);
    return res.value;
  }

  async sendGatherCanidates(webRtcEnd: string) {
    const params = {
      object: webRtcEnd,
      operation: "gatherCandidates",
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("invoke", params);
    console.log(res);
  }

  async subscribe(webRtcEnd: string, eventType: string) {
    const params = {
      type: eventType,
      object: webRtcEnd,
      sessionId: this.sessionId,
    };
    const res = await this.rpc.request("subscribe", params);
    console.log(res);
  }

  async release(objectId: string) {
    const params = {
      object: objectId,
    };
    const res = await this.rpc.request("release", params);
    console.log(res);
  }

  close() {
    this.ws.close();
  }

  async waitForOpenSocket() {
    return new Promise((resolve: (value: void) => void) => {
      if (this.ws.readyState !== this.ws.OPEN) {
        this.ws.addEventListener("open", (_) => {
          console.log("Web Socket is opened!");
          resolve();
        });
      } else {
        resolve();
      }
    });
  }*/
}

export * from './lib/elements';
export * from './lib/types';
