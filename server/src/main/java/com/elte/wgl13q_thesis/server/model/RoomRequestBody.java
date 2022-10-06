package com.elte.wgl13q_thesis.server.model;
public class RoomRequestBody{
    String sessionId;
    String uuid;

    public RoomRequestBody(String sessionId, String uuid) {
        this.sessionId = sessionId;
        this.uuid = uuid;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
}
