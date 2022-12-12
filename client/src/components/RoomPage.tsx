import React, {useEffect, useRef, useState} from "react";
import {MessageType, RoomState} from "../Types";
import "../style/RoomPage.scss";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import {Navigate, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {selectClient, setSessionId} from "../feature/client/clientSlice";
import {
    getConnectedDevices,
    getMedia,
    handleAnswerMessage,
    handleErrorMessage,
    handleICECandidateEvent,
    handleNewICECandidateMessage, handleTrackEvent, openMediaDevices, sendToServer
} from "../CallUtils";
import {generateUuid} from "../Utils";
import {DiscardFormButton} from "./FormButton";
import {selectUser} from "../feature/user/userSlice";

interface VideoState {
    mic: boolean;
    video: boolean;
}

const peerConnectionConfig = {
    'iceServers': [
        {'urls': 'stun:stun.stunprotocol.org:3478'},
        {'urls': 'stun:stun.l.google.com:19302'},
    ]
};


export const RoomPage: React.FC<RoomState> = (props) => {
    let mediaConstraints = {
        audio: true,
        video: true
    };
    let conn = new WebSocket("wss://192.168.0.218:8080/socket");
    let myPeerConnection: RTCPeerConnection;

    let localStream: MediaStream;
    let rtcSender: RTCRtpSender;
    const navigate = useNavigate();

    const client = useAppSelector(selectClient);
    const dispatch = useAppDispatch();

    let remoteVideoRef = useRef<HTMLVideoElement>(null);
    let localVideoRef = useRef<HTMLVideoElement>(null);
    let videoState: VideoState = {mic: true, video: true};
    const [localFeed, setLocalFeed] = useState<VideoState>({mic: true, video: true});
    useEffect(()=>{
        console.log(`Hi`);
    })
    const user = useAppSelector(selectUser);
    if (!user.isAuthenticated) {
        return <Navigate to={"/login"}/>
    }
    const handleVideoControllerChange = (prop: keyof VideoState) => (event: React.ChangeEvent<HTMLInputElement> | any) => {
        if (prop === "mic") {
            mediaConstraints.audio = !mediaConstraints.audio;
             let streamPromise = openMediaDevices(mediaConstraints);
             if(streamPromise!=null){
                 streamPromise.then(stream =>{
                     localStream = stream;
                 })
             }

        } else if (prop === "video") {

            mediaConstraints.video = !mediaConstraints.video;
            let streamPromise = openMediaDevices(mediaConstraints);
            if(streamPromise!=null){
                streamPromise.then(stream =>{
                    localStream = stream;
                })
            }
        }
        console.log(`Changed!${JSON.stringify(mediaConstraints)}`)
        setLocalFeed({...localFeed, [prop]: !localFeed[prop]});
    }


    conn.onmessage = (msg: any) => {
        let message = JSON.parse(msg.data);
        console.log(`[${client.sessionId}]  {from : ${message.from}, data : ${message.data}, language : ${message.language} , proficiencyLevel : ${message.proficiencyLevel}, roomNumber: ${message.roomNumber}}  `);
        switch (message.type) {
            case MessageType.TEXT:
                console.log(`Text message from ${message.from} message data : ${message.data}`);
                break;
            case MessageType.JOIN:
                console.log(`[${client.sessionId}] ${message.data === "true" ? "Negotiation has started" : "Waiting for peer"}`);
                handlePeerConnection(message);
                break;
            case MessageType.OFFER:
                console.log(`Signal OFFER received from ${message.from} message data : ${message.data}`)
                handleOfferMessage(message);
                break;
            case MessageType.ICE:
                handleNewICECandidateMessage(message, client, myPeerConnection);
                break;
            case MessageType.ANSWER:
                handleAnswerMessage(message, client, myPeerConnection);
                break;
            case MessageType.LEAVE:
                console.log(`From : ${message.from} , ${message.data} , ${message.type}`);
                navigate(0);
                break;
            default:
                handleErrorMessage(`Wrong type of message received from server ${message.type}`, client);
                break;
        }
    }

    /*
    Event listener to know when a connection is open.
    */
    conn.onopen = () => {
        console.log(`[${client.sessionId}] WebSocket connection opened to room : #${props.roomID} `);
        /*
        Send a message to the server to join the selected room with WebSocket
         */
        sendToServer(conn, {
            from: client.sessionId,
            type: MessageType.JOIN,
            data: props.roomID,
            proficiencyLevel: props.proficiencyLevel,
            language: props.language,
            roomNumber: props.roomID
        }, client)
    }
    /*
    Event listener for closing socket
    */
    conn.onclose = (message: any) => {
        console.log(`[${client.sessionId}] WebSocket has been closed ${message.type} ${message.data}`);
    }

    /*
    Event handler of socket errors
     */
    conn.onerror = (message: any) => {
        handleErrorMessage(message, client)
    }
    window.onclose = (event) => stop;

    const stop = async () => {
        console.log(`[${client.sessionId}] Sending 'leave' message to server`);

        sendToServer(conn, {
            from: client.sessionId,
            type: MessageType.LEAVE,
            data: props.roomID,
        }, client)

        if (myPeerConnection) {
            myPeerConnection.getSenders().forEach(sender => myPeerConnection.removeTrack(sender))

            //Removing all event listeners
            myPeerConnection.onicecandidate = null;
            myPeerConnection.ontrack = null;
            myPeerConnection.onnegotiationneeded = null;
            myPeerConnection.oniceconnectionstatechange = null;
            myPeerConnection.onsignalingstatechange = null;
            myPeerConnection.onicegatheringstatechange = null;

            //Stopping the videos
            if (localVideoRef.current!.srcObject) {
                if ("getTracks" in localVideoRef.current!.srcObject) {
                    localVideoRef.current!.srcObject.getTracks().forEach((track) => track.stop());
                }
            }

            if (remoteVideoRef.current!.srcObject) {
                if ("getTracks" in remoteVideoRef.current!.srcObject) {
                    remoteVideoRef.current!.srcObject.getTracks().forEach((track) => track.stop());
                }
            }

        }

    }
    const handlePeerConnection = (message: any) => {
        createPeerConnection();
        console.log(`${JSON.stringify(localStream)}, ${JSON.stringify(client)}, ${JSON.stringify(myPeerConnection)}, ${localVideoRef}, ${JSON.stringify(mediaConstraints)}`)
        if (!localFeed.video || !localFeed.mic) {
            return;
        }
        getMedia(localStream, client, myPeerConnection, localVideoRef, mediaConstraints, rtcSender);
        if (message.data === "true") {
            console.log(myPeerConnection)
            myPeerConnection.addEventListener("negotiationneeded", (event: any) => {
                handleNegotiationNeededEvent(event);
            },)

        }
    }

    const createPeerConnection = () => {
        myPeerConnection = new RTCPeerConnection(peerConnectionConfig);
        myPeerConnection.addEventListener("icecandidate", (event: any) => {
            handleICECandidateEvent(event, client, conn)
        }, {once: true})
        console.log(`[${client.sessionId}] creating peer connection`);
        myPeerConnection.addEventListener("track", (event: any) => {
            let handleTrackPromise =  handleTrackEvent(event, client, remoteVideoRef);
            console.log(`HERE handleTrackPromise ${JSON.stringify(handleTrackPromise)}`)
            handleTrackPromise.then(() => console.log(`[${client.sessionId}] Remote video displayed`))
                .catch((err) => console.log(`Error playing remote video ${err}`))
        },)
    }
    const handleNegotiationNeededEvent = (event: Event) => {
        myPeerConnection.createOffer().then((offer: any) => {
            return myPeerConnection.setLocalDescription(offer);
        }).then(() => {
            sendToServer(conn, {
                from: client.sessionId,
                type: MessageType.OFFER,
                sdp: myPeerConnection.localDescription
            }, client)
            console.log(`[${client.sessionId}] : SDP offer sent`)
        }).catch((error: any) => {
            console.log(`[${client.sessionId}] Failure to connect error : ${error}`)
        });
    }

    const handleOfferMessage = (message: any) => {
        console.log(`Accepting OFFER message ${message}`);
        let sessionDescription = new RTCSessionDescription(message.sdp);
        if (sessionDescription != null && message.sdp != null) {
            console.log(`[${client.sessionId}]  RTC signalling state :  ${myPeerConnection.signalingState}`);
            myPeerConnection.setRemoteDescription(sessionDescription).then(() => {
                console.log(`HERE ${localStream}`);
                if (localStream) {
                    localStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
                }
                try{
                    return openMediaDevices(mediaConstraints);
                }catch (error){
                    console.log(`Error accessing media devices. ${error}`);
                }

            }).then((stream: any) => {
                localStream = stream;
                try {
                    localVideoRef.current!.srcObject = localStream;
                } catch (error) {
                    console.log(`${client.sessionId} : ${error}`);
                }
            }).then(() => {
                /*
                After successfully setting our remote description, we need to start our stream locally then create an SDP answer.
                This SDP describes the local end of our call, including codec information, options of SDP,etc..
                 */
                console.log(`[${client.sessionId}] Creating answer`)
                return myPeerConnection.createAnswer();
            }).then((answer: RTCSessionDescriptionInit) => {
                /*
                After having our answer, we establish the local description. This configures our end of the call
                to match the settings specified in the SDP.
                 */
                console.log(`[${client.sessionId}] Setting local description after creating answer`)
                return myPeerConnection.setLocalDescription(answer);
            }).then(() => {
                /*
                We send back the answer to the server with our sessionId and the localDescription.
                 */
                console.log(`[${client.sessionId}] Sending answer packet back to server`);
                sendToServer(conn, {
                    from: client.sessionId,
                    type: MessageType.ANSWER,
                    sdp: myPeerConnection.localDescription
                }, client);

            }).catch((error: any) => handleErrorMessage(error, client));

        }

    }

    const hangUp = () => {
        if (myPeerConnection) {
            stop().then(() => navigate("/start", {replace: true}));
        }
    }

    onbeforeunload = (event: BeforeUnloadEvent) => {
        if (myPeerConnection) {
            stop().then(r => console.log(r));
        }
    }

    const tryNewConnection = () => {
        dispatch(setSessionId(generateUuid()));
        navigate(0)
    }

    const copyRoomURL = async () => {
        const type = "text/plain";
        let textToCopy = window.location.href;
        const blob = new Blob([textToCopy], {type});
        const data = [new ClipboardItem({[type]: blob})]
        console.log(`URL copied : ${textToCopy}`);
        navigator.clipboard.write(data).then((r) => console.log(r));

        let devices = await getConnectedDevices("videoinput");
        console.log(`Connected devices ${JSON.stringify(devices)}`);
    }

    return <div id={"room-container"}>
        <div id={"room-activity"}>
            <div id={"room-details"}>
                <ul>
                    <li>Room Language : {props.language} </li>
                    <li>Proficiency : {props.proficiencyLevel} </li>
                    <li>Room ID : {props.roomID}</li>
                </ul>

            </div>
            <div id={"room-connection-controls"}>
                <DiscardFormButton onClick={() => tryNewConnection()}>Retry connection
                </DiscardFormButton>
                <DiscardFormButton onClick={() => copyRoomURL()}>Copy room URL
                </DiscardFormButton>
            </div>
        </div>

        <div id={"chat-container"}>

            <div id={"incoming-video-container"}>
                <video ref={remoteVideoRef}
                       autoPlay
                       playsInline={true}></video>
            </div>
            <div id={"local-video-container"}>
                <video ref={localVideoRef}
                       autoPlay
                       muted
                       playsInline={true}></video>
            </div>
        </div>
        <div id={"video-controls"}>
            <div id={"controller-container"}>
                {localFeed.video ?
                    <VideocamIcon onClick={handleVideoControllerChange("video")}/> :
                    <VideocamOffIcon onClick={handleVideoControllerChange("video")}/>}
                {localFeed.mic ? <MicIcon onClick={handleVideoControllerChange("mic")}/> :
                    <MicOffIcon onClick={handleVideoControllerChange("mic")}/>}
                <CallEndIcon onClick={() => hangUp()} style={{backgroundColor: "red", borderRadius: "50%"}}/>
            </div>
        </div>

    </div>
}