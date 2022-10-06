package com.elte.wgl13q_thesis.server.model;

public enum MessageType {

    TEXT("text"),
    OFFER("offer"),
    ANSWER("answer"),
    JOIN("join"),
    LEAVE("leave"),
    ICE("ice");

    private final String type;

    private MessageType(String type) {
        this.type = type;
    }

    public boolean equalsType(String otherType) {
        return type.equals(otherType);
    }

    public String toString() {
        return this.type;
    }
}
