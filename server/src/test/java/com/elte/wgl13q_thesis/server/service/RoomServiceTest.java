package com.elte.wgl13q_thesis.server.service;

import com.elte.wgl13q_thesis.server.model.Language;
import com.elte.wgl13q_thesis.server.model.ProficiencyLevel;
import com.elte.wgl13q_thesis.server.model.Room;
import com.elte.wgl13q_thesis.server.util.Parser;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.util.Set;

@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
@Slf4j
public class RoomServiceTest {

    private RoomServiceImpl roomService;
    @Mock
    private Parser parser;

    @BeforeEach
    public void init() {
        roomService = new RoomServiceImpl(parser);
    }


    @Test
    public void testAddRoom() {
        Integer roomId = 1;
        ProficiencyLevel level = ProficiencyLevel.NATIVE;
        Language language = Language.GERMAN;
        roomService.addRoom(new Room(roomId, level, language));
        Room testRoom = roomService.getRooms().iterator().next();
        Assertions.assertNotNull(testRoom);
        Assertions.assertEquals(roomId, testRoom.getId());
        Assertions.assertEquals(level, testRoom.getProficiencyLevel());
        Assertions.assertEquals(language, testRoom.getLanguage());
    }

    @Test
    public void testGetAllRooms() {
        int roomId = 1;
        ProficiencyLevel level = ProficiencyLevel.NATIVE;
        Language language = Language.GERMAN;
        roomService.addRoom(new Room(roomId, level, language));
        roomId = 2;
        level = ProficiencyLevel.BEGINNER;
        language = Language.ENGLISH;
        roomService.addRoom(new Room(roomId, level, language));
        Set<Room> testRooms = roomService.getRooms();
        Assertions.assertNotNull(testRooms);
        Assertions.assertEquals(2, testRooms.size());
    }

    @Test
    public void testGetRoom(){
        Integer roomId = 1;
        ProficiencyLevel level = ProficiencyLevel.NATIVE;
        Language language = Language.GERMAN;
        roomService.addRoom(new Room(roomId, level, language));
        Room testRoom = roomService.getRoom(roomId);
        Assertions.assertNotNull(testRoom);
        Assertions.assertEquals(roomId, testRoom.getId());
        Assertions.assertEquals(level, testRoom.getProficiencyLevel());
        Assertions.assertEquals(language, testRoom.getLanguage());
    }

    @Test
    public void testGetRoomId(){
        Integer roomId = 1;
        ProficiencyLevel level = ProficiencyLevel.NATIVE;
        Language language = Language.GERMAN;
        Room testRoom =new Room(roomId, level, language);
        roomService.addRoom(testRoom);
        roomId =  roomService.getRoomId(testRoom);
        Assertions.assertNotNull(testRoom);
        Assertions.assertEquals(1,roomId);
    }

    @Test
    public void testGetLastIdInRooms(){
        int roomId = 1;
        ProficiencyLevel level = ProficiencyLevel.NATIVE;
        Language language = Language.GERMAN;
        Room testRoom =new Room(roomId, level, language);
        roomService.addRoom(testRoom);
        roomId = 2;
        level = ProficiencyLevel.BEGINNER;
        language = Language.ENGLISH;
        roomService.addRoom(new Room(roomId, level, language));
        int lastId = roomService.getLastIdInRooms();
        Assertions.assertEquals(3,lastId);
    }

}
