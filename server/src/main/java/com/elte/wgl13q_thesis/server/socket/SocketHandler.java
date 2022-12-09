package com.elte.wgl13q_thesis.server.socket;

import com.elte.wgl13q_thesis.server.model.*;
import com.elte.wgl13q_thesis.server.service.RoomServiceImpl;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
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
import java.util.function.Consumer;

@Component
@Slf4j
public class SocketHandler extends TextWebSocketHandler {

    List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    @Autowired
    private RoomServiceImpl roomServiceImpl;

    //    @JsonIgnore
    private final ObjectMapper objectMapper = new ObjectMapper();

    private Map<String, Room> sessionIdToRoomMap = new HashMap<>();

    //    @Override
    public void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage textMessage) {
        try {

            WebSocketMessage message = objectMapper.readValue(textMessage.getPayload(), WebSocketMessage.class);
            log.info("[ws] Message of {} type from {} received", message.getType(), message.getFrom());
            String userName = message.getFrom();
            String data = message.getData();
            log.info("data: " + data);
            String roomNumberString = Optional.ofNullable(message.getRoomNumber()).orElse("");
            ProficiencyLevel proficiencyLevel = Optional.ofNullable(message.getProficiencyLevel()).orElse(ProficiencyLevel.NATIVE);
            Language language = Optional.ofNullable(message.getLanguage()).orElse(Language.GERMAN);
            log.info("language: " + language);
            log.info("level: " + proficiencyLevel);
            log.info("roomNumber: " + roomNumberString);

            Room room;
            switch (message.getType()) {
                // text message from client has been received
                case TEXT -> log.info("[ws] Text message: {}", message.getData());
                // message.data is the text sent by client
                // process text message if needed

                // process signal received from client
                case OFFER, ANSWER, ICE -> {
                    Object candidate = message.getCandidate();
                    Object sdp = message.getSdp();
                    log.info("[ws] Signal: {}",
                            candidate != null
                                    ? candidate.toString().substring(0, 64)
                                    : sdp.toString().substring(0, 64));
                    log.info("Session : " + session.getId());
                    Room existingRoom = sessionIdToRoomMap.get(session.getId());
                    if (existingRoom != null) {
                        Map<String, WebSocketSession> clients = roomServiceImpl.getClients(existingRoom);
                        for (Map.Entry<String, WebSocketSession> client : clients.entrySet()) {
                            log.info("Room : " + existingRoom.getId() + " Client key : " + client.getKey());
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

                // identify user and their peer
                case JOIN -> {
                    // message.getRoomNumber() contains connected room id
                    int roomNumber = 1;
                    if (message.getRoomNumber() != null && message.getLanguage() != null && message.getProficiencyLevel() != null) {
                        roomNumber = Integer.parseInt(message.getRoomNumber());
                        language = message.getLanguage();
                        roomServiceImpl.addRoom(new Room(roomNumber, proficiencyLevel, language));
                    } else {
                        roomServiceImpl.addRoom(new Room(roomNumber));
                    }

                    log.info("[ws] {} has joined Room: #{}", userName, message.getRoomNumber());
                    room = roomServiceImpl.findRoomByStringId(roomNumberString)
                            .orElseThrow(() -> new IOException("Invalid room number received!"));
                    roomServiceImpl.addClient(room, userName, session);
                    sessionIdToRoomMap.put(session.getId(), room);
                }

                case LEAVE -> {
                    // message.getRoomNumber() contains connected room id
                    log.info("[ws] {} is going to leave Room: #{}", userName, message.getData());
                    // room id taken by session id
                    room = sessionIdToRoomMap.get(session.getId());
                    // remove the client which leaves from the Room clients list
                    Optional<String> client = roomServiceImpl.getClients(room).entrySet().stream()
                            .filter(entry -> Objects.equals(entry.getValue().getId(), session.getId()))
                            .map(Map.Entry::getKey)
                            .findAny();
                    Map<String, WebSocketSession> clientSessions = roomServiceImpl.getClients(room);

                    clientSessions.keySet().forEach(log::info);


                    client.ifPresent(c -> roomServiceImpl.removeClientByName(room, c));
                    for (Map.Entry<String, WebSocketSession> clientEntry : clientSessions.entrySet()) {
                        log.info("Notifying user : " + clientEntry.getKey() + " that user : " + client.get() + " left");
                        sendMessage(clientEntry.getValue(),
                                new WebSocketMessage(
                                        clientEntry.getKey(),
                                        MessageType.LEAVE,
                                        room.getId().toString()
                                ));
                    }
//                    session.close();
                }
                default -> {
                    log.info("[ws] Type of the received message {} is undefined!", message.getType());
                }
            }
        } catch (IOException e) {
            log.info("An error occurred in SocketHandler.handleTextMessage : {}", e.getMessage());
        } catch (IllegalStateException e) {
            e.printStackTrace();
            log.info("Illegal state exception : {}", e.getMessage());
        }
    }

    //    @Override
    public void afterConnectionClosed(final WebSocketSession session, @NonNull final CloseStatus status) {
        log.debug("[ws] Session has been closed with status {}", status);
        Room room = sessionIdToRoomMap.get(session.getId());
        sessionIdToRoomMap.remove(session.getId());
        Optional<String> client = roomServiceImpl.getClients(room).entrySet().stream()
                .filter(entry -> Objects.equals(entry.getValue().getId(), session.getId()))
                .map(Map.Entry::getKey)
                .findFirst();
        client.ifPresent(c -> roomServiceImpl.removeClientByName(room, c));
    }

    //    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) {
        sendMessage(session, new WebSocketMessage("Server",
                MessageType.JOIN,
                Boolean.toString(!sessionIdToRoomMap.isEmpty()),
                null,
                null,
                null,
                null,
                null));
//        sendMessage(session, new WebSocketMessage("Server", MessageType.JOIN, Boolean.toString(!sessionIdToRoomMap.isEmpty()), null, null));
        log.info(session.toString());
        log.info(session.getId());
        log.info("[ws] Connection established from {} ", session.getId());
        sessions.add(session);
    }

    private void sendMessage(WebSocketSession session, WebSocketMessage message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            session.sendMessage(new TextMessage(json));
            log.info(json);
        } catch (IOException e) {
            log.debug("An error occurred: {}", e.getMessage());
        }
    }
}
