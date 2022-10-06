import {RootState} from "../../store/store";
import {createSlice} from "@reduxjs/toolkit";
import {ClientSession} from "../../Types";
import {generateUuid} from "../../Utils";


const initialState : ClientSession= {
    sessionId : generateUuid()
}

export const clientSlice = createSlice({
    name: "client",
    initialState: initialState,
    reducers: {
        setSessionId: (state, action) => {
            state.sessionId = action.payload;
        },
        removeSessionId: (state,action) => {
            state.sessionId = action.payload;
        }
    }
})

export const {setSessionId,removeSessionId} = clientSlice.actions;
export const selectClient = (state:RootState) => state.client;
export default clientSlice.reducer;
