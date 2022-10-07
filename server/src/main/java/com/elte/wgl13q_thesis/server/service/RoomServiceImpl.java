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
    // repository substitution
    private final Set<Room> rooms = new TreeSet<>(Comparator.comparing(Room::getId));
//    private final Set<Room> rooms = new HashSet<>();

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

    @Override
    public RoomRequestBody processRoomSelection(RoomRequestBody requestBody, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            log.info("Error with the binding {}", bindingResult.getFieldError());
        }

        //sessionId == room id
        String roomId = requestBody.getId();
        String uuid = requestBody.getUuid();
        ProficiencyLevel level = requestBody.getProficiencyLevel();
        Language language = requestBody.getLanguage();
        log.info("processRoomSelection, room : "+roomId);
        // userId == id
        Optional<Room> roomFound = findRoomByStringId(roomId);

        if (roomFound.isEmpty()) {
            Optional<Integer> optionalId = parser.parseId(roomId);
            optionalId.ifPresent(id -> Optional.ofNullable(uuid).ifPresent(userId -> addRoom(new Room(id, level, language))));
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
//                modelAndView = new ModelAndView("chat_room", "id", sid);
//                modelAndView.addObject("uuid", uuid);
            }
        }
        return null;
    }

    @Override
    public WebSocketSession processRoomExit(String sid, String uuid) {
        if (sid != null && uuid != null) {
            log.debug("User {} has left Room #{}", uuid, sid);
            Optional<Room> room = findRoomByStringId(sid);
            if (room.isPresent()) {
                return removeClientByName(room.get(), uuid);
            }
        }
        return null;
    }

    public WebSocketSession removeClientByName(final Room room, final String name) {
        return room.getClients().remove(name);
    }

    @Override
    public RoomRequestBody requestRandomRoomNumber(String uuid) {
        Long rand = this.randomValue();
        log.info("uuid : {}", uuid);
        log.info("requestRandomRoomNumber : {}", rand);
        return new RoomRequestBody(rand.toString(), uuid);
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


    private Long randomValue() {
        return ThreadLocalRandom.current().nextLong(0, 100);
    }


}
