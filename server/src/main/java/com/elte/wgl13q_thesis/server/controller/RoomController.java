package com.elte.wgl13q_thesis.server.controller;

import com.elte.wgl13q_thesis.server.model.Room;
import com.elte.wgl13q_thesis.server.model.RoomRequestBody;
import com.elte.wgl13q_thesis.server.service.RoomServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;


@RestController
@RequestMapping(path = "api/v1/room")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
@Slf4j

public class RoomController {


    private final RoomServiceImpl roomService;

    @Autowired
    public RoomController(RoomServiceImpl roomService) {
        this.roomService = roomService;
    }

    @GetMapping(path = "{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable("roomId") String roomId) {
        return new ResponseEntity<String>(roomId, HttpStatus.OK);
    }

    @GetMapping(path = "/new/{roomId}")
    public ResponseEntity<?> getNewRoom(@PathVariable("roomId") String roomId) {
        return new ResponseEntity<String>(roomId, HttpStatus.OK);
    }

    @PostMapping(value = "/new")
    public ResponseEntity<?> processRoomSelection(@RequestBody RoomRequestBody requestBody, final BindingResult binding) {
        log.info(requestBody.toString());

        RoomRequestBody roomRequestBody = this.roomService.processRoomSelection(requestBody, binding);
        if (roomRequestBody == null) {
            return new ResponseEntity<>("Room already exists", HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(
                "Room created -> id : " +
                        roomRequestBody.getId() +
                        ", language : " +
                        roomRequestBody.getLanguage() +
                        ", proficiencyLevel : " +
                        roomRequestBody.getProficiencyLevel(), HttpStatus.OK);
    }

    @GetMapping(path = "/{sid}/user/{uuid}")
    public ResponseEntity<?> displaySelectedRoom(@PathVariable("sid") final String sid, @PathVariable("uuid") final String uuid) {
        return new ResponseEntity<RoomRequestBody>(this.roomService.displaySelectedRoom(sid, uuid), HttpStatus.OK);
    }

    @GetMapping(path = "/all")
    public ResponseEntity<?> getAllRooms() {
        Set<Room> rooms = roomService.getRooms();
        Set<RoomResponse> response = new HashSet<>();

        rooms.forEach(room -> {
            log.info(String.valueOf(room.getClients().keySet()));
            RoomResponse responseEntry = new RoomResponse();
            responseEntry.entry.put("roomNumber", room.getId());
            responseEntry.entry.put("language", room.getLanguage());
            responseEntry.entry.put("proficiencyLevel", room.getProficiencyLevel());
            responseEntry.entry.put("clients", room.getClients().keySet());
            response.add(responseEntry);
        });

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(path = "/random")
    public ResponseEntity<?> requestRandomRoomNumber(@RequestBody RoomRequestBody body) {
        return new ResponseEntity<RoomRequestBody>(roomService.requestRandomRoomNumber(body.getUuid()), HttpStatus.OK);
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