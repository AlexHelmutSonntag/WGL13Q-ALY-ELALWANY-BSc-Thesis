import {createSlice} from "@reduxjs/toolkit";
import {Language, ProficiencyLevel} from "../../Types";
import {RootState} from "../../store/store";


interface roomState {
    language: Language;
    level : ProficiencyLevel;
    createdAt : Date;
    capacity : number;
    roomID : string;
}

const initialRoomsState : roomState[] = [{
  language : Language.ENGLISH,
  level : ProficiencyLevel.BEGINNER,
  createdAt : new Date(""),
  capacity : 0,
  roomID : ""
}]

export const roomsSlice = createSlice({
    name:"rooms",
    initialState: initialRoomsState,
    reducers:{
        addRoom : (state,action) =>{
            state.push(action.payload)
        },
        removeRoom : (state,action) => {
            state = state.filter((item) => item.roomID !== action.payload);
        },
        updateCapacity : (state, action)=>{
            state.map((item)=> item.roomID === action.payload.roomID ? item.capacity = action.payload.capacity : "");
        },
        updateLanguage : (state, action) =>{
            state.map((item)=> item.roomID === action.payload.roomID ? item.language = action.payload.language : "");
        },
        updateLevel : (state, action) =>{
            state.map((item)=> item.roomID === action.payload.roomID ? item.level = action.payload.level : "");
        }
    }
})


export const {addRoom,removeRoom,updateCapacity,updateLanguage,updateLevel} = roomsSlice.actions
export const selectRooms = (state : RootState) => state.rooms
export const selectRoomWithId = (state:RootState,roomID:string) => state.rooms.find((item)=> item.roomID===roomID);
export default roomsSlice.reducer;