package com.elte.wgl13q_thesis.server.model;

import com.sun.istack.NotNull;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Room {

    @NotNull
    private final Integer id;

    private final Language language;

    private final ProficiencyLevel proficiencyLevel;
    private final Map<String, WebSocketSession> clients = new HashMap<>();

    public Room(Integer id) {
        this.id = id;
        language = null;
        proficiencyLevel = null;
    }
    public Room(Integer id,ProficiencyLevel proficiencyLevel,Language language) {
        this.id = id;
        this.language = language;
        this.proficiencyLevel = proficiencyLevel;
    }

    public Language getLanguage() {
        return language;
    }

    public ProficiencyLevel getProficiencyLevel() {
        return proficiencyLevel;
    }


    public Integer getId() {
        return id;
    }

    public Map<String, WebSocketSession> getClients() {
        return clients;
    }


    @Override
    public boolean equals(final Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        final Room room = (Room) o;
        return Objects.equals(getId(), room.getId()) &&
                Objects.equals(getClients(), room.getClients());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getClients());
    }

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", language='" + language + '\'' +
                ", proficiencyLevel='" + proficiencyLevel + '\'' +
                ", clients=" + clients +
                '}';
    }
}
