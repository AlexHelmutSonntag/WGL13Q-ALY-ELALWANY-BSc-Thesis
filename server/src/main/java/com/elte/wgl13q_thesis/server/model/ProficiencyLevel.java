package com.elte.wgl13q_thesis.server.model;

public enum ProficiencyLevel {
    NATIVE("Native"),
    ADVANCED("Advanced"),
    FLUENT("Fluent"),
    BEGINNER("Beginner");
    private final String type;

    private ProficiencyLevel(String type) {
        this.type = type;
    }

    public boolean equalsType(String otherType) {
        return type.equals(otherType);
    }

    public String toString() {
        return this.type;
    }
}
