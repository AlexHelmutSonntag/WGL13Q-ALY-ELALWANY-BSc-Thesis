import React from "react";
import {ClientSession, MessageType, UserMediaError} from "./Types";
import ReconnectingWebSocket from "reconnecting-websocket";


export const openMediaDevices = async (constraints: any) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
}

export const getConnectedDevices = async (type: any) => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device=> device.kind===type);
}

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
    console.log(`[${client.sessionId}] Video turned off`);
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

export const handleICECandidateEvent = (event: any, client: ClientSession, websocketConnection: WebSocket | ReconnectingWebSocket) => {
    if (event.candidate) {
        sendToServer(websocketConnection, {
            from: client.sessionId,
            type: MessageType.ICE,
            candidate: event.candidate
        }, client);
    }
}

export const handleNegotiationNeededEvent = (event: Event, peerConnection: RTCPeerConnection, client: ClientSession, websocketConnection: WebSocket | ReconnectingWebSocket) => {
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

export const handleTrackEvent = async (event: any, client: ClientSession, remoteVideoRef: React.RefObject<HTMLVideoElement>) => {

    remoteVideoRef.current!.srcObject = event.streams[0];
    return await remoteVideoRef.current!.play();

}


export const getMedia = async (localStream: MediaStream, client: ClientSession, peerConnection: RTCPeerConnection, localVideoRef: React.RefObject<HTMLVideoElement>, constrains: any, sender: RTCRtpSender) => {
    console.log(`HERE localStream ${localStream}`)
    if (localStream) {
        localStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    try {

        localStream = await navigator.mediaDevices.getUserMedia(constrains)
        localVideoRef.current!.srcObject = localStream;
        localVideoRef.current!.onloadedmetadata = (async (ev: any) => {
            let localVideoPlayPromise = await localVideoRef.current!.play();
            console.log(`[${client.sessionId}] Local video displayed`)
        })
        localStream.getTracks().forEach((track: MediaStreamTrack) => {
                console.log(`HERE ${JSON.stringify(track)} ${JSON.stringify(localStream)}`)

                sender = peerConnection.addTrack(track, localStream)
            }
        )
    } catch (error) {
        console.log(`Error when playing local video${error}`)
        handleGetUserMediaError(error, client)
    }
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
export const sendToServer = (conn: WebSocket | ReconnectingWebSocket, message: any, client: ClientSession) => {
    if (!isOpen(conn)) {
        // console.log(conn)
        console.log("socket not open!");
    }
    conn.send(JSON.stringify(message));
    console.log(`[${client.sessionId}] Message sent : ${message.type} ${message.data} `)
}

const isOpen = (connection: WebSocket | ReconnectingWebSocket) => {
    return connection.readyState === connection.OPEN;
}

export const handleErrorMessage = (error: any, client: ClientSession) => {
    console.log(`[${client.sessionId}] Error : ${JSON.stringify(error)}`)
}

