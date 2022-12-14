package com.elte.wgl13q_thesis.server.service;

import com.elte.wgl13q_thesis.server.model.Language;
import com.elte.wgl13q_thesis.server.model.ProficiencyLevel;
import com.elte.wgl13q_thesis.server.model.Room;
import com.elte.wgl13q_thesis.server.model.RoomRequestBody;
import com.elte.wgl13q_thesis.server.util.Parser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.socket.WebSocketSession;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Slf4j
public class RoomServiceImpl implements RoomService {
    private final Parser parser;
    private final Set<Room> rooms = new TreeSet<>(Comparator.comparing(Room::getId));

    @Autowired
    public RoomServiceImpl(final Parser parser) {
        this.parser = parser;
    }


    public Set<Room> getRooms() {
        final Set<Room> defensiveCopy = new TreeSet<>(Comparator.comparing(Room::getId));
        defensiveCopy.addAll(rooms);
        log.info("getting rooms : " + defensiveCopy);
        return defensiveCopy;
    }

    public void addRoom(final Room room) {
        rooms.add(room);
    }

    public Set<Room> deleteAllRooms() {
        Set<Room> returnSet = getRooms();
        rooms.clear();
        return returnSet;
    }

    public Room getRoom(Integer id) {
        return rooms.stream().filter(room -> room.getId().equals(id)).findFirst().orElse(null);
    }

    public Room removeRoom(Integer roomId) {
        Room roomFound = rooms.stream().filter(room -> room.getId().equals(roomId)).findAny().orElse(null);

        if (roomFound != null) {
            if (roomFound.getClients().size() == 0) {
                rooms.remove(roomFound);
                log.info("Room removed");
                return roomFound;
            }
            log.info("Room not empty");
            return roomFound;
        }
        return null;
    }

    public int getLastIdInRooms() {
        int id = 0;
        List<Room> roomsArray = new ArrayList<>(rooms);

        for (Room room : roomsArray) {
            if (room.getId() > id) {
                id = room.getId();
            }
        }
        if (id == 0) {
            id = 1;
        } else {
            id = id + 1;
        }
        log.info("last room id in the set : " + id);
        return id;
    }

    @Override
    public RoomRequestBody processRoomSelection(RoomRequestBody requestBody, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            log.info("Error with the binding {}", bindingResult.getFieldError());
        }
        int roomIdInt = 1;
        if (rooms.size() != 0) {
            roomIdInt = getLastIdInRooms();
        }
        String roomId = String.valueOf(roomIdInt);
        String uuid = requestBody.getUuid();
        ProficiencyLevel level = requestBody.getProficiencyLevel();
        Language language = requestBody.getLanguage();

        Optional<Room> roomFound = findRoomByStringId(roomId);
        if (roomFound.isEmpty()) {
            Optional<Integer> optionalId = parser.parseId(roomId);
            addRoom(new Room(roomIdInt, level, language));
            String value = String.format("id : %s , uuid : %s , level : %s , language : %s", optionalId.orElse(null), uuid, level, language);
            log.info("Room created  : " + value);

            assert optionalId.orElse(null) != null;
            return new RoomRequestBody(optionalId.orElse(null).toString(), uuid, level, language);
        } else {
            return null;
        }
    }

    @Override
    public RoomRequestBody displaySelectedRoom(String sid, String uuid) {
        log.info("displaySelectedRoom -  sid : {}  uuid : {}", sid, uuid);
        if (parser.parseId(sid).isPresent()) {
            Room room = findRoomByStringId(sid).orElse(null);
            if (room != null && uuid != null && !uuid.isEmpty()) {
                log.debug("User {} is going to join Room #{}", uuid, sid);
                // open the chat room
                return new RoomRequestBody(sid, uuid);
            }
        }
        return null;
    }


    public WebSocketSession removeClientByName(final Room room, final String name) {
        return room.getClients().remove(name);
    }

    public Optional<Room> findRoomByStringId(final String sid) {
        // simple get() because of parser errors handling
        return rooms.stream().filter(r -> r.getId().equals(parser.parseId(sid).orElse(null))).findAny();
    }

    public Integer getRoomId(Room room) {
        return room.getId();
    }

    public Map<String, WebSocketSession> getClients(final Room room) {
        return Optional.ofNullable(room)
                .map(r -> Collections.unmodifiableMap(r.getClients()))
                .orElse(Collections.emptyMap());
    }

    public void addClient(final Room room, final String name, final WebSocketSession session) {
        room.getClients().put(name, session);
    }

}
