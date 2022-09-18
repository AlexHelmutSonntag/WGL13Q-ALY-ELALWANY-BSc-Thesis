import {Gender, Role} from "../../Types";
import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../store/store";


export interface PersistentUserState {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    dob: string;
    gender: Gender;
    role?: Role;
    accessToken: string;
    isAuthenticated: boolean;
}

const initialUserState: PersistentUserState = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    gender: Gender.MALE,
    dob: new Date("1999-01-01").toLocaleDateString(),
    isAuthenticated: false,
    accessToken: ""
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setFirstname: (state, action) => {
            state.firstName = action.payload;
        },
        setLastname: (state, action) => {
            state.lastName = action.payload;
        },
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        removeUsername: (state, action) => {
            state.firstName = action.payload
        },
        removeUser: (state, action) => {
            state.firstName = "";
            state.lastName = "";
            state.username = "";
            state.dob = "";
            state.accessToken = "";
            state.isAuthenticated = false;
            state.email = "";
        },
        setGender: (state, action) => {
            state.gender = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
        setDOB: (state, action) => {
            state.dob = action.payload;
        },
    }
})

export const {
    setUsername,
    setFirstname,
    setLastname,
    setGender,
    setRole,
    setDOB,
    setAuthenticated,
    setEmail,
    removeUser
} = userSlice.actions
export const selectUser = (state: RootState) => state.user
export default userSlice.reducer;
