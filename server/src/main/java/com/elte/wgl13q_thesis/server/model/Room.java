package com.elte.wgl13q_thesis.server.model;

import com.sun.istack.NotNull;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Room {

    @NotNull
    private final Integer id;

    private final Language language;

    private final ProficiencyLevel proficiencyLevel;

    private LocalDate createdAt;
    private Map<String, WebSocketSession> clients = new HashMap<>();

    public Room(Integer id) {
        this.id = id;
        language = null;
        proficiencyLevel = null;
    }
    public Room(Integer id,ProficiencyLevel proficiencyLevel,Language language) {
        this.id = id;
        this.language = language;
        this.proficiencyLevel = proficiencyLevel;
        this.createdAt = LocalDate.now();
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
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
    public void addClient(Map.Entry<String,WebSocketSession> client){
        clients.put(client.getKey(),client.getValue());
    }
    public void setClients(Map<String, WebSocketSession> clients) {
        this.clients = clients;
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
