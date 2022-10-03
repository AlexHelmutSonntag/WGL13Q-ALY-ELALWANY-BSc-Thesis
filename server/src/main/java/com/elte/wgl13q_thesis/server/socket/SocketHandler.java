package com.elte.wgl13q_thesis.server.socket;

import com.elte.wgl13q_thesis.server.model.MessageType;
import com.elte.wgl13q_thesis.server.model.Room;
import com.elte.wgl13q_thesis.server.model.WebSocketMessage;
import com.elte.wgl13q_thesis.server.service.RoomServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
@Slf4j
public class SocketHandler extends TextWebSocketHandler {

    List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();


    @Autowired
    private RoomServiceImpl roomServiceImpl;

    private final ObjectMapper objectMapper = new ObjectMapper();


    private Map<String, Room> sessionIdToRoomMap = new HashMap<>();

    @Override
    public void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage textMessage) {
        try {
            WebSocketMessage message = objectMapper.readValue(textMessage.getPayload(), WebSocketMessage.class);
            log.debug("[ws] Message of {} type from {} received", message.getType(), message.getFrom());
            String userName = message.getFrom(); // origin of the message
            String data = message.getData(); // payload

            Room room;
            switch (message.getType()) {
                // text message from client has been received
                case TEXT -> log.debug("[ws] Text message: {}", message.getData());
                // message.data is the text sent by client
                // process text message if needed

                // process signal received from client
                case OFFER, ANSWER, ICE -> {
                    Object candidate = message.getCandidate();
                    Object sdp = message.getSdp();
                    log.debug("[ws] Signal: {}",
                            candidate != null
                                    ? candidate.toString().substring(0, 64)
                                    : sdp.toString().substring(0, 64));
                    Room existingRoom = sessionIdToRoomMap.get(session.getId());
                    if (existingRoom != null) {
                        Map<String, WebSocketSession> clients = roomServiceImpl.getClients(existingRoom);
                        for (Map.Entry<String, WebSocketSession> client : clients.entrySet()) {
                            if (!client.getKey().equals(userName)) {
                                sendMessage(client.getValue(),
                                        new WebSocketMessage(
                                                userName,
                                                message.getType(),
                                                data,
                                                candidate,
                                                sdp));
                            }
                        }
                    }
                }

                // identify user and their opponent
                case JOIN -> {
                    // message.data contains connected room id
                    log.debug("[ws] {} has joined Room: #{}", userName, message.getData());
                    room = roomServiceImpl.findRoomByStringId(data)
                            .orElseThrow(() -> new IOException("Invalid room number received!"));
                    roomServiceImpl.addClient(room, userName, session);
                    sessionIdToRoomMap.put(session.getId(), room);
                }
                case LEAVE -> {
                    // message data contains connected room id
                    log.debug("[ws] {} is going to leave Room: #{}", userName, message.getData());
                    // room id taken by session id
                    room = sessionIdToRoomMap.get(session.getId());
                    // remove the client which leaves from the Room clients list
                    Optional<String> client = roomServiceImpl.getClients(room).entrySet().stream()
                            .filter(entry -> Objects.equals(entry.getValue().getId(), session.getId()))
                            .map(Map.Entry::getKey)
                            .findAny();
                    client.ifPresent(c -> roomServiceImpl.removeClientByName(room, c));
                }
                default -> {
                    log.debug("[ws] Type of the received message {} is undefined!", message.getType());
                }
            }
        } catch (IOException e) {
            log.debug("An error occured: {}", e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(final WebSocketSession session,@NonNull final CloseStatus status) {
        log.debug("[ws] Session has been closed with status {}", status);
        sessionIdToRoomMap.remove(session.getId());
    }

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) {
        sendMessage(session, new WebSocketMessage("Server", MessageType.JOIN, Boolean.toString(!sessionIdToRoomMap.isEmpty()), null, null));
        log.info("[ws] Connection established from {} ", session.getId());

        sessions.add(session);
    }

    private void sendMessage(WebSocketSession session, WebSocketMessage message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            session.sendMessage(new TextMessage(json));
        } catch (IOException e) {
            log.debug("An error occurred: {}", e.getMessage());
        }
    }
}
