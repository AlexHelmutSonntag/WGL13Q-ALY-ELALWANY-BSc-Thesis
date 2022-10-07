package com.elte.wgl13q_thesis.server.model;

public class Payload {

    private String from;
    private MessageType type;
    private String data;
    private Object candidate;
    private Object sdp;
    private String language;
    private String proficiencyLevel;
    private String roomNumber;

    public Payload(String from, MessageType type, String data, Object candidate, Object sdp, String language, String proficiencyLevel, String roomNumber) {
        this.from = from;
        this.type = type;
        this.data = data;
        this.candidate = candidate;
        this.sdp = sdp;
        this.language = language;
        this.proficiencyLevel = proficiencyLevel;
        this.roomNumber = roomNumber;
    }

    public Payload() {
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Object getCandidate() {
        return candidate;
    }

    public void setCandidate(Object candidate) {
        this.candidate = candidate;
    }

    public Object getSdp() {
        return sdp;
    }

    public void setSdp(Object sdp) {
        this.sdp = sdp;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(String proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }
}
