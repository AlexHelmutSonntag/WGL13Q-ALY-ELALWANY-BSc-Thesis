export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}

export enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}

export enum Language {
    GERMAN = "GERMAN",
    ENGLISH = "ENGLISH",
    HUNGARIAN = "HUNGARIAN",
    SPANISH = "SPANISH",
    FRENCH = "FRENCH",
    ARABIC ="ARABIC",
    DUTCH= "DUTCH",
    TURKISH ="TURKISH",
    SWEDISH ="SWEDISH",
    NORWEGIAN ="NORWEGIAN",
    ICELANDIC="ICELANDIC",
    DANISH ="DANISH",
    FINNISH ="FINNISH",
    CHINESE ="CHINESE",

}

export enum ProficiencyLevel {
    BEGINNER = "BEGINNER",
    FLUENT = "FLUENT",
    ADVANCED = "ADVANCED",
    NATIVE = "NATIVE",
}

export enum UserMediaError {
    NOT_FOUND_ERROR = "NotFoundError",
    SECURITY_ERROR = "SecurityError",
    PERMISSION_DENIED_ERROR = "PermissionDeniedError"
}

export enum MessageType {
    TEXT = "TEXT",
    OFFER = "OFFER",
    ANSWER = "ANSWER",
    JOIN = "JOIN",
    LEAVE = "LEAVE",
    ICE = "ICE"
}

export interface ClientSession {
    sessionId: string;
}

export interface RoomState {
    language: Language;
    proficiencyLevel: ProficiencyLevel;
    capacity?: number;
    createdAt: Date;
    roomID: string;
    clients: string[];
}

export type FilterState = Pick<RoomState, "language" | "proficiencyLevel" | "capacity"> & {
    filter: boolean;
}
export type NewRoomState = Pick<RoomState, "language" | "proficiencyLevel" | "createdAt">


export type UserState = {
    firstName: string;
    lastName: string;
    dob: Date | null;
    gender: Gender;
    role?: Role;
    username: string;
    email: string;
    password: string;
    repeatedPassword: string;
    showPassword: boolean;
    passwordsEqual: boolean;
    validEmail: boolean;
}

export type UserProps = UserState & {
    passValuesToParent?: (value: UserState) => void;
}

export type AuthenticatedUser = UpdateUserState & {
    isAuthenticated: boolean;
    accessToken: string;
}

export type UpdateUserState = Pick<UserProps, "firstName" | "lastName" | "dob" | "gender" | "role" | "username" | "email" | "password" | "passValuesToParent">
export type LoginState = Pick<UserState, "email" | "password" | "validEmail" | "showPassword" | "username">;
