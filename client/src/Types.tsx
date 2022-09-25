export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}
export enum Role{
    USER = "USER",
    ADMIN = "ADMIN"
}

export enum Language{
    GERMAN= "German",
    ENGLISH = "English",
    HUNGARIAN = "Hungarian",
    SPANISH = "Spanish",
    FRENCH = "French"
}

export enum ProficiencyLevel{
    NATIVE ="Native",
    ADVANCED = "Advanced",
    FLUENT =  "Fluent",
    BEGINNER = "Beginner"
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

export type AuthenticatedUser = UpdateUserState &{
    isAuthenticated:boolean;
    accessToken: string;
}

export type UpdateUserState = Pick<UserProps,"firstName"|"lastName"|"dob"|"gender"|"role"|"username"|"email"|"password"|"passValuesToParent">

export type LoginState = Pick<UserState, "email" | "password" | "validEmail" | "showPassword" | "username">;
