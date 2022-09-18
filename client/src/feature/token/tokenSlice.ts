import {RootState} from "../../store/store";
import {createSlice} from "@reduxjs/toolkit";

export const tokenSlice = createSlice({
    name: "token",
    initialState: {value: ""},
    reducers: {
        setToken: (state, action) => {
            state.value = action.payload;
        },
        removeToken: (state,action) => {
            state.value = action.payload;
        }
    }
})

export const {setToken,removeToken} = tokenSlice.actions
export const selectToken = (state: RootState) => state.token.value
export default tokenSlice.reducer;