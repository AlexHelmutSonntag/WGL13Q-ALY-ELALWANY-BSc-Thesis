package com.elte.wgl13q_thesis.server.model;

public class RoomRequestBody {
    String id;
    String uuid;
    ProficiencyLevel proficiencyLevel;
    Language language;

    public ProficiencyLevel getProficiencyLevel() {
        return proficiencyLevel;
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
    }

    public RoomRequestBody() {

    }

    public RoomRequestBody(String id, String uuid, ProficiencyLevel proficiencyLevel, Language language) {
        this.id = id;
        this.uuid = uuid;
        this.proficiencyLevel = proficiencyLevel;
        this.language = language;
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
