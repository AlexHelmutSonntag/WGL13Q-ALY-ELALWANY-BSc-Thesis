package com.elte.wgl13q_thesis.server.model;

import java.util.Objects;

public class WebSocketMessage {
    private String from;
    private MessageType type;
    private String data;
    private Object candidate;
    private Object sdp;
    private Language language;
    private ProficiencyLevel proficiencyLevel;
    private String roomNumber;

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public ProficiencyLevel getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public WebSocketMessage() {

    }

    public WebSocketMessage(final String from,
                            final MessageType type,
                            final String data,
                            final Object candidate,
                            final Object sdp) {
        this.candidate = candidate;
        this.from = from;
        this.data = data;
        this.sdp = sdp;
        this.type = type;
    }

    public WebSocketMessage(String from, MessageType type, String data, Object candidate, Object sdp, Language language, ProficiencyLevel proficiencyLevel, String roomNumber) {
        this.from = from;
        this.type = type;
        this.data = data;
        this.candidate = candidate;
        this.sdp = sdp;
        this.language = language;
        this.proficiencyLevel = proficiencyLevel;
        this.roomNumber = roomNumber;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(final String from) {
        this.from = from;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(final MessageType type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(final String data) {
        this.data = data;
    }

    public Object getCandidate() {
        return candidate;
    }

    public void setCandidate(final Object candidate) {
        this.candidate = candidate;
    }

    public Object getSdp() {
        return sdp;
    }

    public void setSdp(final Object sdp) {
        this.sdp = sdp;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof WebSocketMessage that)) return false;
        return Objects.equals(this.getFrom(), that.getFrom()) &&
                Objects.equals(this.getType(), that.getType()) &&
                Objects.equals(this.getData(), that.getData()) &&
                Objects.equals(this.getCandidate(), that.getCandidate()) &&
                Objects.equals(this.getSdp(), that.getSdp());
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.getFrom(), this.getType(), this.getData(), this.getCandidate(), this.getSdp());
    }

    @Override
    public String toString() {
        return "WebSocketMessage{" +
                "from='" + from + '\'' +
                ", type=" + type +
                ", data='" + data + '\'' +
                ", candidate=" + candidate +
                ", sdp=" + sdp +
                ", language=" + language +
                ", proficiencyLevel=" + proficiencyLevel +
                ", roomNumber='" + roomNumber + '\'' +
                '}';
    }
}
