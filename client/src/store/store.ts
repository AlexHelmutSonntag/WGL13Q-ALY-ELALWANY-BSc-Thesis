import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {userSlice} from "../feature/user/userSlice";
import storage from "redux-persist/lib/storage"
import {persistReducer} from "redux-persist";
import {tokenSlice} from "../feature/token/tokenSlice";
import {roomsSlice} from "../feature/rooms/roomsSlice";


const persistConfig = {
    key: "root",
    version: 1,
    storage
}

const appReducer = combineReducers({
    token: tokenSlice.reducer,
    user: userSlice.reducer,
    rooms: roomsSlice.reducer
})

export const rootReducer = (state: any, action: any) => {
    if (action.type === `USER_LOGOUT`) {
        storage.removeItem('persist:root').then(result => console.log(result)).then(err => console.error(err));
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
