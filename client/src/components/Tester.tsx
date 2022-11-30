export {}
// import React, {ChangeEvent, useRef} from "react";
// import axios from "axios";
// import {useNavigate} from "react-router-dom";
// import {useAppDispatch, useAppSelector} from "../store/hooks";
// import {selectToken} from "../feature/token/tokenSlice";
// import {selectUser} from "../feature/user/userSlice";
// import {ClientSession, Language, ProficiencyLevel, RoomState, UserMediaError} from "../Types";
// import {addRoom, removeAllRooms, selectRooms} from "../feature/rooms/roomsSlice";
// import '../style/Tester.scss';
// import {generateUuid} from "../Utils";
// import {selectClient} from "../feature/client/clientSlice";
// import {MessageType} from "../Types";
// import {
//     muteMic,
//     turnVideoOff,
//     turnVideoOn,
//     sendToServer,
//     handleErrorMessage,
//     handleNewICECandidateMessage,
//     handleAnswerMessage,
//     handleICECandidateEvent,
//     handleTrackEvent,
//     // createPeerConnection,
//     getLocalMediaStream, getMedia
// } from "../CallUtils";
// import {PeerCertificate} from "tls";
//
// let conn = new WebSocket("wss://192.168.0.218:8080/socket");
//
// const mediaConstraints = {
//     audio: true,
//     video: true
// };
//
// /*
// WebRTC STUN servers
// -> To be changed
//  */
// const peerConnectionConfig = {
//     'iceServers': [
//         {'urls': 'stun:stun.stunprotocol.org:3478'},
//         {'urls': 'stun:stun.l.google.com:19302'},
//     ]
// };
//
// export const Tester: React.FC = () => {
//     let myPeerConnection: RTCPeerConnection;
//     let alternativePeerConnection: RTCPeerConnection;
//     let localStream: MediaStream;
//     let localVideoTracks: MediaStreamTrack[];
//     const navigate = useNavigate();
//     let [localVideoSrc, setLocalVideoSrc] = React.useState<string>('');
//     const [roomNumber, setRoomNumber] = React.useState<any>(1);
//     let remoteVideoRef = useRef<HTMLVideoElement>(null);
//     let localVideoRef = useRef<HTMLVideoElement>(null);
//
//
//     conn.onmessage = (msg: any) => {
//         let message = JSON.parse(msg.data);
//         console.log(`[${client.sessionId}]  {from : ${message.from}, data : ${message.data}, language : ${message.language} , proficiencyLevel : ${message.proficiencyLevel}, roomNumber: ${message.roomNumber}}  `);
//         switch (message.type) {
//             case MessageType.TEXT:
//                 console.log(`Text message from ${message.from} message data : ${message.data}`);
//                 break;
//             case MessageType.JOIN:
//                 console.log(`[${client.sessionId}] ${message.data === "true" ? "Negotiation has started" : "Waiting for peer"}`);
//                 handlePeerConnection(message);
//                 break;
//             case MessageType.OFFER:
//                 console.log(`Signal OFFER received from ${message.from} message data : ${message.data}`)
//                 handleOfferMessage(message);
//                 break;
//             case MessageType.ICE:
//                 handleNewICECandidateMessage(message, client, myPeerConnection);
//                 break;
//             case MessageType.ANSWER:
//                 handleAnswerMessage(message, client, myPeerConnection);
//                 break;
//             default:
//                 handleErrorMessage(`Wrong type of message received from server ${message.type}`, client);
//                 break;
//         }
//     }
//
//     /*
//     Event listener to know when a connection is open.
//      */
//     conn.onopen = () => {
//         console.log(`[${client.sessionId}] WebSocket connection opened to room : #${roomNumber} `);
//
//         /*
//         Send a message to the server to join the selected room with WebSocket
//          */
//         let level = ProficiencyLevel.NATIVE;
//         let language = Language.GERMAN;
//         sendToServer(conn, {
//             from: client.sessionId,
//             type: MessageType.JOIN,
//             data: roomNumber,
//             proficiencyLevel: level,
//             language: language,
//             roomNumber: roomNumber
//         }, client)
//     }
//
//     /*
//     Event listener for closing socket
//      */
//     conn.onclose = (message: any) => {
//         console.log(`[${client.sessionId}] WebSocket has been closed ${message.type} ${message.data}`);
//     }
//
//     /*
//     Event handler of socket errors
//      */
//     conn.onerror = (message: any) => {
//         handleErrorMessage(message, client)
//     }
//     window.onclose = (event)=> stop;
//     const stop = () => {
//         console.log(`[${client.sessionId}] Sending 'leave' message to server`);
//         sendToServer(conn, {
//             from: client.sessionId,
//             type: MessageType.LEAVE,
//             data: roomNumber,
//         }, client)
//
//
//         if (myPeerConnection) {
//             console.log(`[${client.sessionId}] Close the RTCPeerConnection`);
//
//             //Removing all event listeners
//             myPeerConnection.onicecandidate = null;
//             myPeerConnection.ontrack = null;
//             myPeerConnection.onnegotiationneeded = null;
//             myPeerConnection.oniceconnectionstatechange = null;
//             myPeerConnection.onsignalingstatechange = null;
//             myPeerConnection.onicegatheringstatechange = null;
//             // myPeerConnection.onnotificationneeded = null;
//             // myPeerConnection.onremovetrack = null;
//
//             //Stopping the videos
//             // if (localVideoRef.current!.srcObject) {
//             //     if ("getTracks" in localVideoRef.current!.srcObject) {
//             //         localVideoRef.current!.srcObject.getTracks().forEach((track) => track.stop())
//             //     }
//             // }
//             // if (remoteVideoRef.current!.srcObject) {
//             //     if ("getTracks" in remoteVideoRef.current!.srcObject) {
//             //         remoteVideoRef.current!.srcObject.getTracks().forEach((track) => track.stop())
//             //     }
//             // }
//
//             localVideoRef.current!.srcObject = null;
//
//             remoteVideoRef.current!.srcObject = null;
//
//             //Closing the peer connection
//             // myPeerConnection.close();
//             // conn.close();
//             // myPeerConnection = null;
//             console.log(`[${client.sessionId}] Close the socket`);
//
//             // if (conn != null) {
//             //     conn.close();
//             // }
//
//         }
//
//     }
//
//     const handlePeerConnection = (message: any) => {
//         // createPeerConnection(conn,client,myPeerConnection,peerConnectionConfig,remoteVideoRef);
//         createPeerConnection();
//         getMedia(localStream,client,myPeerConnection,localVideoRef,mediaConstraints);
//         // getMedia(mediaConstraints);
//         if (message.data === "true") {
//             console.log(myPeerConnection)
//             myPeerConnection.addEventListener("negotiationneeded", (event)=>{
//                 handleNegotiationNeededEvent(event);
//             })
//             // myPeerConnection.onnegotiationneeded = (event)=>{
//             //     handleNegotiationNeededEvent(event);
//             // };
//         }
//     }
//
//     const createPeerConnection = () => {
//         myPeerConnection = new RTCPeerConnection(peerConnectionConfig);
//         myPeerConnection.addEventListener("icecandidate", (event: any) => {
//             handleICECandidateEvent(event, client, conn)
//         })
//         // myPeerConnection.oncandidate = handleICECandidateEvent(client,conn);
//         console.log(`[${client.sessionId}] creating peer connection`);
//         myPeerConnection.addEventListener("track", (event: any) => {
//             handleTrackEvent(event, client, remoteVideoRef);
//         })
//         // myPeerConnection.ontrack = handleTrackEvent;
//     }
//
//     // const getMedia = (constrains: any) => {
//     //     if (localStream) {
//     //         localStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
//     //     }
//     //     navigator.mediaDevices.getUserMedia(constrains)
//     //         // .then(getLocalMediaStream).catch(handleGetUserMediaError);
//     //         .then((mediaStream:MediaStream) => getLocalMediaStream(mediaStream,localStream,client,localVideoRef,myPeerConnection)).catch(handleGetUserMediaError)
//     // }
//
//     // const getLocalMediaStream = (mediaStream: MediaStream) => {
//     //     localStream = mediaStream;
//     //     console.log(`[${client.sessionId}] Getting local media stream`);
//     //     localVideoRef.current!.srcObject = localStream;
//     //     localVideoRef.current!.onloadedmetadata = ((ev: any) => {
//     //         localVideoRef.current!.play().then(() => console.log(`[${client.sessionId}] Local video displayed`)).catch((err) => console.log(`Error when playing ${err}`))
//     //     })
//     //     localStream.getTracks().forEach((track: MediaStreamTrack) => myPeerConnection.addTrack(track, localStream));
//     // }
//
//     // const handleGetUserMediaError = (error: any) => {
//     //     console.log(`[${client.sessionId}] Error getting user media : ${error.message}`);
//     //     switch (error.name) {
//     //         case UserMediaError.NOT_FOUND_ERROR:
//     //             alert(`Unable to open the call because no camera and/or microphone were found!`);
//     //             break;
//     //         case UserMediaError.SECURITY_ERROR:
//     //         case UserMediaError.PERMISSION_DENIED_ERROR:
//     //             alert(`Security Error or permission denied`);
//     //             break;
//     //         default:
//     //             // alert(`Error opening your camera and/or microphone ${error.message}`);
//     //             console.log(`Error opening your camera and/or microphone ${error.message}`);
//     //             break;
//     //     }
//     // }
//     //
//     // const handleICECandidateEvent = (event: any) => {
//     //     console.log(`[${client.sessionId}] ICE Candidate Event ? ${event.candidate}`);
//     //     if (event.candidate) {
//     //         sendToServer(conn,{
//     //             from: client.sessionId,
//     //             type: MessageType.ICE,
//     //             candidate: event.candidate
//     //         },client);
//     //
//     //         console.log(`[${client.sessionId}] ICE Candidate Event : ICE Candidate sent ${event.candidate}`);
//     //     }
//     // }
//
//     // const handleTrackEvent = (event: any) => {
//     //     console.log(`[${client.sessionId}] Setting stream to remote video element`);
//     //     remoteVideoRef.current!.srcObject = event.streams[0];
//     // }
//
//     const handleNegotiationNeededEvent = (event:Event) => {
//         console.log(`[${client.sessionId}] Negotiation needed event : ${event}`)
//
//         myPeerConnection.createOffer().then((offer: any) => {
//             return myPeerConnection.setLocalDescription(offer);
//         }).then(() => {
//             sendToServer(conn, {
//                 from: client.sessionId,
//                 type: MessageType.OFFER,
//                 sdp: myPeerConnection.localDescription
//             }, client)
//
//             console.log(`[${client.sessionId}] : SDP offer sent`)
//
//         }).catch((error: any) => {
//             console.log(`[${client.sessionId}] Failure to connect error : ${error}`)
//         });
//     }
//
//     const handleOfferMessage = (message: any) => {
//         console.log(`Accepting OFFER message ${message}`);
//
//         let sessionDescription = new RTCSessionDescription(message.sdp);
//         if (sessionDescription != null && message.sdp != null) {
//             console.log(`[${client.sessionId}]  RTC signalling state :  ${myPeerConnection.signalingState}`);
//             myPeerConnection.setRemoteDescription(sessionDescription).then(() => {
//                 console.log(`${client.sessionId} : Setup local media stream`);
//                 return navigator.mediaDevices.getUserMedia(mediaConstraints);
//             }).then((stream: any) => {
//                 console.log(`[${client.sessionId}] Local video stream obtained`);
//                 localStream = stream;
//                 try {
//                     localVideoRef.current!.srcObject = localStream;
//
//                 } catch (error) {
//                     setLocalVideoSrc(window.URL.createObjectURL(stream));
//                 }
//                 console.log(`[${client.sessionId}] Adding stream to the RTCPeerConnection`);
//                 localStream.getTracks().forEach((track: MediaStreamTrack) => myPeerConnection.addTrack(track, localStream));
//             }).then(() => {
//                 /*
//                 After successfully setting our remote description, we need to start our stream locally then create an SDP answer.
//                 This SDP describes the local end of our call, including codec information, options of SDP,etc..
//                  */
//                 console.log(`[${client.sessionId}] Creating answer`)
//                 return myPeerConnection.createAnswer();
//             }).then((answer: any) => {
//                 /*
//                 After having our answer, we establish the local description. This configures our end of the call
//                 to match the settings specified in the SDP.
//                  */
//                 console.log(`[${client.sessionId}] Setting local description after creating answer`)
//                 return myPeerConnection.setLocalDescription(answer);
//             }).then(() => {
//                 /*
//                 We send back the answer to the server with our sessionId and the localDescription.
//                  */
//                 console.log(`[${client.sessionId}] Sending answer packet back to server`);
//                 sendToServer(conn, {
//                     from: client.sessionId,
//                     type: MessageType.ANSWER,
//                     sdp: myPeerConnection.localDescription
//                 }, client);
//
//             }).catch(error=>handleErrorMessage(error,client));
//
//         }
//
//     }
//
//     /*
//         Configures the remote description, which is the SDP payload
//      */
//
//     // const handleAnswerMessage = (message: any) => {
//     //     console.log(`[${client.sessionId}] Received  message ${message.data} from ${message.from}`);
//     //     myPeerConnection.setRemoteDescription(message.sdp).catch(handleErrorMessage);
//     // }
//     //
//
//     // const handleNewICECandidateMessage = (message: any) => {
//     //     let candidate = new RTCIceCandidate(message.candidate);
//     //     // let candidate = new RTCIceCandidate(message.payload.candidate);
//     //     console.log(`[${client.sessionId}] Adding received ICE candidate ${JSON.stringify(candidate)}`)
//     //     myPeerConnection.addIceCandidate(candidate).catch(handleErrorMessage);
//     // }
//
//
//     const client = useAppSelector(selectClient);
//     const user = useAppSelector(selectUser);
//     const rooms = useAppSelector(selectRooms);
//     const accessToken = useAppSelector(selectToken);
//     const dispatch = useAppDispatch();
//
//
//     let config: any;
//     if (accessToken) {
//         config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`
//             }
//         }
//     }
//
//     const getRoom = (body: any) => {
//         axios.get(`https://192.168.0.218:8080/api/v1/room/${body.roomID}`, config
//         ).then((response) => {
//             console.log(response);
//             if (response.status === 200) {
//                 navigate(`/room/${body.roomID}`);
//             }
//         }).catch((error) => console.log(error));
//     }
//
//
//     const [msg, setMsg] = React.useState('');
//
//     const sendMsg = () => {
//         sendToServer(conn, client.sessionId, client);
//     }
//
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const openCameraAndMic = () => {
//         console.log('clicked')
//         console.log(navigator);
//         navigator.mediaDevices.getUserMedia(mediaConstraints).then((mediaStream: MediaStream) => {
//             videoRef.current!.srcObject = mediaStream;
//             videoRef.current!.onloadedmetadata = ((ev: any) => {
//                 videoRef.current!.play().then(() => console.log('played')).catch((err) => console.log(`Error when playing ${err}`));
//             });
//             console.log(mediaStream);
//         })
//     }
//
//     const closeCameraAndMic = () => {
//         const media = navigator.mediaDevices.getUserMedia(mediaConstraints)
//         media.then((stream: MediaStream) => {
//             stream.getTracks().forEach((track: MediaStreamTrack) => {
//                 track.stop()
//                 videoRef.current!.pause();
//                 videoRef.current!.srcObject = null;
//             })
//         }).catch((err) => console.log(err))
//     }
//
//
//     return <div>
//         <h1>Tester</h1>
//         <h2>Client : {client.sessionId}</h2>
//         {/*<button onClick={() => getRoom({roomID: 3})}>Room 3</button>*/}
//         {/*<button onClick={() => addRoomToStore()}>Create room</button>*/}
//         {/*<button onClick={() => getRooms()}>Get rooms</button>*/}
//         {/*<button onClick={() => emptyRooms()}>Remove all rooms</button>*/}
//         <input value={msg} onChange={(event) => setMsg(event.target.value)}/>Msg
//         <button onClick={() => sendMsg()}>Send msg</button>
//         {/*Room #<input value={roomNumber} onChange={(event) => setRoomNumber(event.target.value)}/>*/}
//         {/*<button onClick={() => console.log(`Room number ${roomNumber}`)}>Print Room</button>*/}
//         <button onClick={() => openCameraAndMic()}>Open Video & Audio</button>
//         <button onClick={() => closeCameraAndMic()}>Close Video & Audio</button>
//
//         <button onClick={() => videoRef.current!.muted = !videoRef.current!.muted}>Toggle Audio self</button>
//         <button onClick={() => turnVideoOn(localVideoRef, localVideoTracks, localStream, client)}>Turn video on</button>
//         <button onClick={() => turnVideoOff(localVideoRef, localVideoTracks, localStream, client)}>Turn video off
//         </button>
//         <button onClick={() => muteMic(localVideoRef, client, false)}>Turn mic on</button>
//         <button onClick={() => muteMic(localVideoRef, client, true)}>Turn mic off</button>
//         <button onClick={() => stop()}>Exit</button>
//
//         <div id={"video-grid"}>
//             {/*You might need to test the src and ref attributes of video tag*/}
//             <video id={"local-video"} ref={localVideoRef} src={localVideoSrc} style={{outline: "solid 1px blue"}}
//                    autoPlay
//                    playsInline={true}>vid
//             </video>
//             <video id={"remote-video"} ref={remoteVideoRef} style={{outline: "solid 1px red"}} autoPlay
//                    playsInline={true}>vid
//             </video>
//             <video id={"test-video"} ref={videoRef} autoPlay>Test</video>
//         </div>
//
//     </div>
// }
