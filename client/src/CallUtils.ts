import React from "react";
import {ClientSession, MessageType, UserMediaError} from "./Types";
import ReconnectingWebSocket from "reconnecting-websocket";


export const muteMic = (videoRef: React.RefObject<HTMLVideoElement>, client: ClientSession, value: boolean) => {
    videoRef.current!.muted = value;
    console.log(`[${client.sessionId}] Mic turned off`);
}

export const turnVideoOn = (videoRef: React.RefObject<HTMLVideoElement>, localVideoTracks: MediaStreamTrack[], localStream: MediaStream, client: ClientSession) => {
    localVideoTracks = localStream.getVideoTracks();
    localVideoTracks.forEach((track: MediaStreamTrack) => localStream.addTrack(track))
    videoRef.current!.hidden = false;
    console.log(`[${client.sessionId}] Video turned on`);
}

export const turnVideoOff = (videoRef: React.RefObject<HTMLVideoElement>, localVideoTracks: MediaStreamTrack[], localStream: MediaStream, client: ClientSession) => {
    localVideoTracks = localStream.getVideoTracks();
    localVideoTracks.forEach((track: MediaStreamTrack) => localStream.addTrack(track))
    videoRef.current!.hidden = true;
    console.log(`[${client.sessionId}] Video turned on`);
}


export const handleNewICECandidateMessage = (message: any, client: ClientSession, peerConnection: RTCPeerConnection) => {
    let candidate = new RTCIceCandidate(message.candidate);
    console.log(`[${client.sessionId}] Adding received ICE candidate ${JSON.stringify(candidate)}`)
    peerConnection.addIceCandidate(candidate).catch(error => handleErrorMessage(error, client));
}

export const handleAnswerMessage = (message: any, client: ClientSession, peerConnection: RTCPeerConnection) => {
    console.log(`[${client.sessionId}] Received  message ${message.data} from ${message.from}`);
    peerConnection.setRemoteDescription(message.sdp).catch(error => handleErrorMessage(error, client));
}

export const handleICECandidateEvent = (event: any, client: ClientSession, websocketConnection: WebSocket|ReconnectingWebSocket) => {
    // console.log(`[${client.sessionId}] ICE Candidate Event ? ${event.candidate}`);
    if (event.candidate) {
        sendToServer(websocketConnection, {
            from: client.sessionId,
            type: MessageType.ICE,
            candidate: event.candidate
        }, client);
        // console.log(`[${client.sessionId}] ICE Candidate Event : ICE Candidate sent ${event.candidate}`);
    }
}

export const handleNegotiationNeededEvent = (event:Event,peerConnection:RTCPeerConnection,client:ClientSession,websocketConnection:WebSocket|ReconnectingWebSocket) => {
    console.log(`[${client.sessionId}] Negotiation needed event : ${event}`)

    peerConnection.createOffer().then((offer: any) => {
        return peerConnection.setLocalDescription(offer);
    }).then(() => {
        sendToServer(websocketConnection, {
            from: client.sessionId,
            type: MessageType.OFFER,
            sdp: peerConnection.localDescription
        }, client)

        console.log(`[${client.sessionId}] : SDP offer sent`)

    }).catch((error: any) => {
        console.log(`[${client.sessionId}] Failure to connect error : ${error}`)
    });
}

export const handleTrackEvent = (event: any, client: ClientSession, remoteVideoRef: React.RefObject<HTMLVideoElement>) => {
    console.log(`[${client.sessionId}] Setting stream to remote video element`);
    remoteVideoRef.current!.srcObject = event.streams[0];
    remoteVideoRef.current!.play().then(() => console.log(`[${client.sessionId}] Remote video displayed`)).catch((err) => console.log(`Error playing remote video ${err}`))

}

//
// export const createPeerConnection = (websocketConnection: WebSocket, client: ClientSession, peerConnection: RTCPeerConnection, peerConnectionConfig: any, remoteVideoRef: React.RefObject<HTMLVideoElement>) => {
//     peerConnection = new RTCPeerConnection(peerConnectionConfig);
//     peerConnection.addEventListener("icecandidate", (event: any) => {
//         handleICECandidateEvent(event, client, websocketConnection)
//     })
//     console.log(`[${client.sessionId}] creating peer connection`);
//     peerConnection.addEventListener("track", (event: any) => {
//         handleTrackEvent(event, client, remoteVideoRef);
//     })
// }

export const getMedia = (localStream: MediaStream, client: ClientSession, peerConnection: RTCPeerConnection, localVideoRef: React.RefObject<HTMLVideoElement>, constrains: any) => {
    if (localStream) {
        localStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    navigator.mediaDevices.getUserMedia(constrains)
        .then((mediaStream: MediaStream) => getLocalMediaStream(mediaStream, localStream, client, localVideoRef, peerConnection)).catch((error: any) => handleGetUserMediaError(error, client))
}

export const getLocalMediaStream = (mediaStream: MediaStream, localStream: MediaStream, client: ClientSession, localVideoRef: React.RefObject<HTMLVideoElement>, peerConnection: RTCPeerConnection) => {
    localStream = mediaStream;
    // console.log(`[${client.sessionId}] Getting local media stream`);
    localVideoRef.current!.srcObject = localStream;
    localVideoRef.current!.onloadedmetadata = ((ev: any) => {
        // if(localVideoRef.current!.paused)
            localVideoRef.current!.play().then(() => console.log(`[${client.sessionId}] Local video displayed`)).catch((err) => console.log(`Error when playing local video${err}`))
    })
    // console.log(localStream)
    localStream.getTracks().forEach((track: MediaStreamTrack) => peerConnection.addTrack(track, localStream));
}

export const handleGetUserMediaError = (error: any, client: ClientSession) => {
    console.log(`[${client.sessionId}] Error getting user media : ${error.message}`);
    switch (error.name) {
        case UserMediaError.NOT_FOUND_ERROR:
            alert(`Unable to open the call because no camera and/or microphone were found!`);
            break;
        case UserMediaError.SECURITY_ERROR:
        case UserMediaError.PERMISSION_DENIED_ERROR:
            alert(`Security Error or permission denied`);
            break;
        default:
            // alert(`Error opening your camera and/or microphone ${error.message}`);
            console.log(`Error opening your camera and/or microphone ${error.message}`);
            break;
    }
}


//messaging
export const sendToServer = (conn: WebSocket|ReconnectingWebSocket, message: any, client: ClientSession) => {
    if (!isOpen(conn)) {
        console.log(conn)
        console.log("socket not open!");
        // conn = new WebSocket("wss://192.168.0.218:8080/socket");
    }
    conn.send(JSON.stringify(message));
    console.log(`[${client.sessionId}] Message sent : ${message.type} ${message.data} `)
}

const isOpen = (connection: WebSocket|ReconnectingWebSocket) => {
    return connection.readyState === connection.OPEN;
}

export const handleErrorMessage = (error: any, client: ClientSession) => {
    console.log(`[${client.sessionId}] Error : ${JSON.stringify(error)}`)
}

