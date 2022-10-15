package com.elte.wgl13q_thesis.server.model;

import java.time.LocalDate;

public class RoomRequestBody {
    private String id;
    private  String uuid;
    private ProficiencyLevel proficiencyLevel;
    private Language language;

    private LocalDate createdAt;
    public ProficiencyLevel getProficiencyLevel() {
        return proficiencyLevel;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public RoomRequestBody(String id, String uuid) {
        this.id = id;
        this.uuid = uuid;
        this.createdAt = LocalDate.now();
    }

    public RoomRequestBody() {

    }

    public RoomRequestBody(String id, String uuid, ProficiencyLevel proficiencyLevel, Language language) {
        this.id = id;
        this.uuid = uuid;
        this.proficiencyLevel = proficiencyLevel;
        this.language = language;
        this.createdAt = LocalDate.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }


    @Override
    public String toString() {
        return "RoomRequestBody{" +
                "id='" + id + '\'' +
                ", uuid='" + uuid + '\'' +
                ", proficiencyLevel=" + proficiencyLevel +
                ", language=" + language +
                '}';
    }
}
