package com.elte.wgl13q_thesis.server.controller;

import com.elte.wgl13q_thesis.server.model.Room;
import com.elte.wgl13q_thesis.server.model.RoomRequestBody;
import com.elte.wgl13q_thesis.server.service.AppUserService;
import com.elte.wgl13q_thesis.server.service.RoomService;
import com.elte.wgl13q_thesis.server.service.RoomServiceImpl;
import com.elte.wgl13q_thesis.server.util.Parser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

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
        RoomRequestBody fromService = this.roomService.processRoomSelection(requestBody.getSessionId(), requestBody.getUuid(), binding);
        return new ResponseEntity<RoomRequestBody>(fromService, HttpStatus.OK);
    }

    @GetMapping(path = "/{sid}/user/{uuid}")
    public ResponseEntity<?> displaySelectedRoom(@PathVariable("sid") final String sid, @PathVariable("uuid") final String uuid){
        return new ResponseEntity<RoomRequestBody>(this.roomService.displaySelectedRoom(sid,uuid), HttpStatus.OK);
    }

    @GetMapping(path = "/all")
    public ResponseEntity<?> getAllRooms() {
        return new ResponseEntity<Set<Room>>(roomService.getRooms(), HttpStatus.OK);
    }

    @GetMapping(path = "/random")
    public ResponseEntity<?> requestRandomRoomNumber(@RequestBody RoomRequestBody body) {
        return new ResponseEntity<RoomRequestBody>(roomService.requestRandomRoomNumber(body.getUuid()), HttpStatus.OK);
    }

}
