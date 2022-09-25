import React from "react";
import {Navigate} from "react-router-dom";
import {useAppSelector} from "../store/hooks";
import {selectUser} from "../feature/user/userSlice";
import {RoomFilter} from "./RoomFilter";
import {FilterState, Language, ProficiencyLevel} from "../Types";
import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';


interface state {
    isAuthenticated: boolean;
}

const rows = [
    {
        language: Language.ENGLISH,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "615e889c-e52f-4cb3-81a2-a17be13593c8",
    },
    {
        language: Language.ENGLISH,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "391d04b7-fea8-41c9-9e33-f56b54d463e2",
    },
    {
        language: Language.ENGLISH,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "2c56f22a-57e8-4a3f-97c3-dea33c075ece",
    },
    {
        language: Language.ENGLISH,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.SPANISH,
        level: ProficiencyLevel.BEGINNER,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.GERMAN,
        level: ProficiencyLevel.FLUENT,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.HUNGARIAN,
        level: ProficiencyLevel.NATIVE,
        capacity: 2,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.GERMAN,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.GERMAN,
        level: ProficiencyLevel.ADVANCED,
        capacity: 2,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.GERMAN,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        level: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
]


const roomsAsListItems = rows.map(item => {
    let strList = Object.values(item).join("\t")
    return <ListItem disablePadding style={{
        border: "2px solid grey",
        borderRadius: "10px",
        margin: "3px",
        backgroundColor: `rgba(58, 80, 107, 0.8)`,
        wordSpacing: "190px",
        color: '#FFFFFF',
    }}>
        <ListItemButton>
            <ListItemText
                primary={strList}/>
        </ListItemButton>
    </ListItem>
})

export const StartPage: React.FC<state> = (props) => {
    let receiveFilter = (state: FilterState) => {
        console.log(state)
    }
    const user = useAppSelector(selectUser);
    if (!user.isAuthenticated) {
        return <Navigate to={"/login"}/>
    }
    const handleAddButtonClick = () => {
        console.log("clicked")
    }

    return (
        <div style={{
            backgroundColor: '#3a506b',
            padding: '10px 10px 10px 10px',
            minHeight: '95vh',
            minWidth: '85vw',
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
        }}>
            <h1 style={{color: "#FFFFFF", paddingBottom: "30px"}}>
                Available rooms
            </h1>
            <div style={{
                backgroundColor: '#1C2541',
                minHeight: '70vh',
                maxHeight: "80vh",
                minWidth: "80vw",
                maxWidth: "90vw",
                borderRadius: "10px",
                paddingBottom:"10px",
            }}>
                <div id={"filter-addbutton"}
                     style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <RoomFilter sendFilterInput={receiveFilter}/>
                    <div>
                        <AddCircleIcon onClick={handleAddButtonClick} style={{
                            color: "#5BC0BE",
                            marginRight: "10px",
                            borderRadius: "30px",
                            fontSize: "xxx-large",
                        }} sx={{
                            size: "large",
                            '&:hover': {
                                cursor: "pointer",
                            }
                        }}
                        />
                    </div>
                </div>
                <div id="room-section" style={{
                    overflowY: "scroll",
                    maxHeight: '70vh',
                    paddingBottom: '1px',
                }}>
                    <List style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        color: "#FFFFFF",
                        marginTop: "10px",
                        marginLeft:"2px",
                        marginRight:"2px",
                        padding:"5px",
                        border: "1px solid #3A506BCC",
                        borderRadius: "5px",
                    }}
                    >
                        <ListItem sx={{
                            textAlign: "left", width: "fit-content",
                            // outline: "1px solid red",
                        }} disablePadding>
                            <ListItemText primary={"Language"}/>
                        </ListItem>
                        <ListItem sx={{
                            textAlign: "center",
                            width: "150px",
                            // outline: "1px solid green",
                        }} disablePadding>
                            <ListItemText primary={"Level"}/>
                        </ListItem>
                        <ListItem sx={{
                            width: "150px",
                            textAlign: "center",
                            // outline: "1px solid green",
                        }} disablePadding>
                            <ListItemText primary={"Capacity"}/>
                        </ListItem>
                        <ListItem sx={{
                            width: "150px",
                            textAlign: "left",
                            // outline: "1px solid green",
                        }} disablePadding>
                            <ListItemText primary={"Created"}/>
                        </ListItem>
                        <ListItem sx={{
                            textAlign: "center",
                            width: "300px",
                            // outline: "1px solid green",
                        }} disablePadding>
                            <ListItemText primary={"Room ID"}/>
                        </ListItem>
                    </List>
                    <List sx={{
                        '& .MuiList-root': {
                            // outline: "10px solid red",
                        },
                        '& .MuiListItemText-root': {},
                    }}
                    >
                        {roomsAsListItems}
                    </List>
                </div>
            </div>
        </div>
    )
}