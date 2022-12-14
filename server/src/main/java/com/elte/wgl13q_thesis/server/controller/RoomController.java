package com.elte.wgl13q_thesis.server.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.elte.wgl13q_thesis.server.model.AppUserRole;
import com.elte.wgl13q_thesis.server.model.Room;
import com.elte.wgl13q_thesis.server.model.RoomRequestBody;
import com.elte.wgl13q_thesis.server.service.RoomServiceImpl;
import com.elte.wgl13q_thesis.server.util.AuthUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

import static java.util.Arrays.stream;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;


@RestController
@RequestMapping(path = "api/v1/room")
@Slf4j
public class RoomController {


    private final RoomServiceImpl roomService;

    @Autowired
    public RoomController(RoomServiceImpl roomService) {
        this.roomService = roomService;
    }

    @GetMapping(path = "/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable("roomId") String roomId) {
        try {
            Optional<Room> roomOptional = this.roomService.findRoomByStringId(roomId);
            if (roomOptional.isPresent()) {
                Room room = roomOptional.get();
                Map<String, Object> response = new HashMap<>();
                response.put("roomNumber", room.getId());
                response.put("language", room.getLanguage());
                response.put("proficiencyLevel", room.getProficiencyLevel());
                response.put("createdAt", room.getCreatedAt());
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<String>("No room with id : " + roomId, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            String message = e.getMessage();
            return new ResponseEntity<String>(message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/new")
    public ResponseEntity<?> processRoomSelection(@RequestBody RoomRequestBody requestBody, final BindingResult binding) {

        log.info(requestBody.toString());
        if (requestBody.getId() == null || requestBody.getUuid() == null || requestBody.getProficiencyLevel() == null || requestBody.getLanguage() == null) {
            return new ResponseEntity<>("Body missing attributes", HttpStatus.BAD_REQUEST);
        }
        RoomRequestBody roomRequestBody = this.roomService.processRoomSelection(requestBody, binding);
        if (roomRequestBody == null) {
            return new ResponseEntity<>("Room already exists", HttpStatus.CONFLICT);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("roomNumber", roomRequestBody.getId());
        response.put("language", roomRequestBody.getLanguage());
        response.put("proficiencyLevel", roomRequestBody.getProficiencyLevel());
        response.put("createdAt", roomRequestBody.getCreatedAt());

        return new ResponseEntity<>(
                response, HttpStatus.CREATED);
    }

    @DeleteMapping(path = "/{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable("roomId") Integer roomId, @RequestHeader(AUTHORIZATION) String authorizationHeader) {
        try {
            DecodedJWT decodedJWT = AuthUtils.createDecodedJWT(authorizationHeader);
            String[] roles = AuthUtils.getRolesFromDecodedJWT(decodedJWT);
            boolean isAdmin = stream(roles).anyMatch(role -> role.equalsIgnoreCase(String.valueOf(AppUserRole.ADMIN)));

            for (String role :
                    roles) {
                log.info(role);
            }
            log.info(String.valueOf(isAdmin));
            if (isAdmin) {
                log.info("here");
                String roomIdString = roomId.toString();
                Optional<Room> roomOptional = roomService.findRoomByStringId(roomIdString);
                log.info(String.valueOf(roomOptional.isEmpty()));
                if (roomOptional.isEmpty()) {
                    return new ResponseEntity<>("Room not found", HttpStatus.NOT_FOUND);
                }
                Room removedRoom = roomService.removeRoom(roomId);
                if (removedRoom != null) {
                    return new ResponseEntity<>(removedRoom, HttpStatus.OK);
                }
            }
            return new ResponseEntity<>("Unauthorized!", HttpStatus.FORBIDDEN);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(path = "/all")
    public ResponseEntity<?> deleteAllRooms() {
        Set<Room> removedRooms = roomService.deleteAllRooms();
        return new ResponseEntity<>(removedRooms, HttpStatus.OK);
    }

    @GetMapping(path = "/all")
    public ResponseEntity<?> getAllRooms() {
        try {
            Set<Room> rooms = roomService.getRooms();
            List<RoomResponse> response = new ArrayList<>();
            rooms.forEach(room -> {
                log.info(room.toString());
            });
            rooms.forEach(room -> {
                log.info(String.valueOf(room.getClients().keySet()));
                RoomResponse responseEntry = new RoomResponse();
                responseEntry.entry.put("roomNumber", room.getId());
                responseEntry.entry.put("language", room.getLanguage());
                responseEntry.entry.put("proficiencyLevel", room.getProficiencyLevel());
                responseEntry.entry.put("clients", room.getClients().keySet());
                responseEntry.entry.put("createdAt", room.getCreatedAt());
                response.add(responseEntry);
            });
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Server issue encountered " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

class RoomResponse {
    Map<String, Object> entry;

    public Map<String, Object> getEntry() {
        return entry;
    }

    public void setEntry(Map<String, Object> entry) {
        this.entry = entry;
    }

    public RoomResponse() {
        this.entry = new HashMap<>();

    }
}