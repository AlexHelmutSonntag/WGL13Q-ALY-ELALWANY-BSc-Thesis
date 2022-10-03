package com.elte.wgl13q_thesis.server.model;

import java.util.Objects;

public class WebSocketMessage {
    private String from;
    private MessageType type;
    private String data;
    private Object candidate;
    private Object sdp;

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
        return Objects.equals(this.from, that.getFrom()) &&
                Objects.equals(this.type, that.getType()) &&
                Objects.equals(this.data, that.getData()) &&
                Objects.equals(this.candidate, that.getCandidate()) &&
                Objects.equals(this.sdp, that.getSdp());
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.from, this.type, this.data, this.candidate, this.sdp);
    }

    @Override
    public String toString() {
        return "WebSocketMessage{" +
                "from='" + from + '\'' +
                ", type='" + type + '\'' +
                ", data='" + data + '\'' +
                ", candidate=" + candidate +
                ", sdp=" + sdp +
                '}';
    }

}
