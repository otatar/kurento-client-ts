import KurentoClient from '../../src/build/module';

const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');

const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
startButton?.addEventListener('click', startCall);
stopButton?.addEventListener('click', stopCall);

let localMedia;
let remoteMedia;
let kurentoClient;
let pipeline;
let webRtcEnd;

async function startCall() {
  try {
    localMedia = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideo && localMedia) {
      localVideo.srcObject = localMedia;
    }
  } catch (e) {
    if (e instanceof DOMException) {
      console.log('Error ' + e.code + ', message: ' + e.message);
    } else {
      console.log('Unknown error: ' + e);
    }
    return;
  }

  remoteMedia = new MediaStream();
  if (remoteVideo && remoteMedia) {
    remoteVideo.srcObject = remoteMedia;
  }

  //Lets create RTC Peer connection
  const peerConnection = new RTCPeerConnection();
  const localIceCandidates = [];

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log('Connection change: ' + peerConnection.connectionState);
  });
  peerConnection.addEventListener('iceconnectionstatechange', () =>
    console.log('Ice connecton: ' + peerConnection.iceConnectionState)
  );
  peerConnection.addEventListener('icegatheringstatechange', () =>
    console.log('Ice gathering: ' + peerConnection.iceGatheringState)
  );
  peerConnection.addEventListener('icecandidateerror', (e) =>
    console.log('Ice candidate error: ' + e)
  );
  peerConnection.addEventListener('icecandidate', (e) => {
    if (e.candidate) console.log('Adding local candidate');
    //console.log("Local ice candidate: " + e.candidate?.candidate);
    localIceCandidates.push(e.candidate);
  });
  peerConnection.addEventListener('track', (e) => {
    console.log('Remote track');
    e.streams[0].getTracks().forEach((track) => remoteMedia.addTrack(track));
  });

  //Add media to RTC Peer connection
  localMedia.getTracks().forEach((track) => peerConnection.addTrack(track));

  //Create SDP offer
  const offer = await peerConnection.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  await peerConnection.setLocalDescription(offer);

  //Working with kurento client
  kurentoClient = new KurentoClient('ws://192.168.6.170:8888/kurento');

  //lets ping
  await kurentoClient.ping();

  //Create pipline
  pipeline = await kurentoClient.createMediaPipeline();

  //Create webRTC endpoint
  if (pipeline) {
    webRtcEnd = await pipeline.createWebRtcEndpoint();
  }

  if (webRtcEnd) {
    //Connect loop
    await pipeline?.connect(webRtcEnd, webRtcEnd);

    //Listen for remote ice
    webRtcEnd.on('IceCandidateFound', (event) => {
      peerConnection.addIceCandidate(event.data?.candidate);
    });

    //Subscribe for ice candidate found event
    await webRtcEnd.subscribe('IceCandidateFound');

    //Send local offer
    const remoteSdp = await webRtcEnd.sendLocalOffer(offer.sdp);
    peerConnection.setRemoteDescription({
      type: 'answer',
      sdp: remoteSdp ?? undefined,
    });

    //Gather remote ice
    await webRtcEnd.gatherCandidates();

    //Send local candidates
    localIceCandidates.forEach(
      async (candidate) => await webRtcEnd?.addIceCandidate(candidate)
    );

    //Test
    const test = await webRtcEnd.getSinkConnections('VIDEO');
    console.log(test);
  }
}

async function stopCall() {
  if (localMedia) localMedia.getTracks().forEach((track) => track.stop());
  if (remoteMedia) remoteMedia.getTracks().forEach((track) => track.stop());
  if (webRtcEnd) {
    pipeline?.disconnect(webRtcEnd, webRtcEnd);
    await webRtcEnd?.release();
    await pipeline?.release();
  }
  //kurentoClient.close();
}
