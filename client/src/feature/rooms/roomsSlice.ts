import {createSlice} from "@reduxjs/toolkit";
import {Language, ProficiencyLevel, RoomState} from "../../Types";
import {RootState} from "../../store/store";


const initialRoomsState : RoomState[] = [{
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
            console.log(`Room removed : ${action.payload}`)
        },
        updateCapacity : (state, action)=>{
            state.map((item)=> item.roomID === action.payload.roomID ? item.capacity = action.payload.capacity : "");
            console.log(`Capacity updated  : ${action.payload.capacity}`)
        },
        updateLanguage : (state, action) =>{
            state.map((item)=> item.roomID === action.payload.roomID ? item.language = action.payload.language : "");
            console.log(`Language updated  : ${action.payload.language}`)
        },
        updateLevel : (state, action) =>{
            state.map((item)=> item.roomID === action.payload.roomID ? item.level = action.payload.level : "");
            console.log(`Level updated  : ${action.payload.level}`)
        },
        removeAllRooms : (state,action)=>{
            state = [];
            console.log('All rooms removed')
        }
    }
})


export const {removeAllRooms,addRoom,removeRoom,updateCapacity,updateLanguage,updateLevel} = roomsSlice.actions
export const selectRooms = (state : RootState) => state.rooms
export const selectRoomWithId = (state:RootState,roomID:string) => state.rooms.find((item)=> item.roomID===roomID);
export default roomsSlice.reducer;