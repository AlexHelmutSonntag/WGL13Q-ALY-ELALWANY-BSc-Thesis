package com.elte.wgl13q_thesis.server.model;

public enum Language {
    GERMAN("German"),
    ENGLISH("English"),
    HUNGARIAN("Hungarian"),
    SPANISH("Spanish"),
    FRENCH("French");

    private final String type;

    private Language(String type) {
        this.type = type;
    }

    public boolean equalsType(String otherType) {
        return type.equals(otherType);
    }

    public String toString() {
        return this.type;
    }
}
