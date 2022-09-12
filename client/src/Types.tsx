export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}
export enum Role{
    USER = "USER",
    ADMIN = "ADMIN"
}

export type UserState = {
    firstName: string;
    lastName: string;
    date: Date | null;
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


export type UpdateUserState = Pick<UserProps,"firstName"|"lastName"|"username"|"email"|"date"|"role"|"password"|"gender"|"passValuesToParent">

export type LoginState = Pick<UserState, "email" | "password" | "validEmail" | "showPassword" | "username">;