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
    FRENCH = "FRENCH"
}

export enum ProficiencyLevel {
    NATIVE = "NATIVE",
    ADVANCED = "ADVANCED",
    FLUENT = "FLUENT",
    BEGINNER = "BEGINNER"
}

export interface RoomState {
    language: Language;
    level: ProficiencyLevel;
    createdAt: Date;
    capacity: number;
    roomID: string;
}

export enum UserMediaError{
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

export interface FilterState {
    language?: Language;
    level?: ProficiencyLevel;
    capacity?: number;
}

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
