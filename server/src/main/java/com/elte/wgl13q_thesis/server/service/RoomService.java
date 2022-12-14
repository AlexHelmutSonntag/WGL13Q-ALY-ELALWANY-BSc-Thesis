package com.elte.wgl13q_thesis.server.service;

import com.elte.wgl13q_thesis.server.model.RoomRequestBody;
import org.springframework.validation.BindingResult;

public interface RoomService {

    RoomRequestBody processRoomSelection(RoomRequestBody requestBody, BindingResult bindingResult);
    RoomRequestBody displaySelectedRoom(String sid, String uuid);
}
