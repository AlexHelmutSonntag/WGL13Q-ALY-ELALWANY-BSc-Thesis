import React from "react";
import {ClientSession} from "../Types";

class Socket {
    videoRef: React.RefObject<HTMLVideoElement>
    client: ClientSession
    localVideoTracks: MediaStreamTrack[]
    localStream: MediaStream;
    connection: WebSocket;

    constructor(videoRef: React.RefObject<HTMLVideoElement>, client: ClientSession, localVideoTracks: MediaStreamTrack[], localStream: MediaStream) {
        this.videoRef = videoRef
        this.client = client
        this.localVideoTracks = localVideoTracks
        this.localStream = localStream;
        this.connection = new WebSocket("ws://192.168.0.218:8080/socket");
    }

    muteMic(value: boolean) {
        this.videoRef.current!.muted = value;
        console.log(`[${this.client.sessionId}] Mic turned off`);
    }

    sendToServer(message: any) {
        if (!this.isConnectionOpen()) {
            console.log(this.connection)
            console.log("socket not open!");
        }
        this.connection.send(JSON.stringify(message));
        console.log(`[${this.client.sessionId}] Message sent : ${message.payload.type} ${message.payload.data} `)
    }

    isConnectionOpen() {
        return this.connection.readyState === this.connection.OPEN;
    }

    handleErrorMessage(error:any){
        console.log(`[${this.client.sessionId}] Error : ${ JSON.stringify(error)}`)
    }
}


export {Socket}