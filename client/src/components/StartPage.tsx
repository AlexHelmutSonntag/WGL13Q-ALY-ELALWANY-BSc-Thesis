import React, {useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {selectUser} from "../feature/user/userSlice";
import {RoomFilter} from "./RoomFilter";
import {FilterState, Gender, Language, NewRoomState, ProficiencyLevel, RoomState, UserState} from "../Types";
import {Button, List, ListItem, ListItemButton, ListItemText, MenuItem, Modal, TextField} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import Popup from "reactjs-popup";
import {DiscardFormButton, ReturnFormButton} from "./FormButton";
import axios from "axios";
import {selectClient} from "../feature/client/clientSlice";
import {selectToken} from "../feature/token/tokenSlice";
import {languageOptions, levelOptions} from "../Utils";

const rows = [
    {
        language: Language.ENGLISH,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "615e889c-e52f-4cb3-81a2-a17be13593c8",
    },
    {
        language: Language.ENGLISH,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "391d04b7-fea8-41c9-9e33-f56b54d463e2",
    },
    {
        language: Language.ENGLISH,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "2c56f22a-57e8-4a3f-97c3-dea33c075ece",
    },
    {
        language: Language.ENGLISH,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.SPANISH,
        proficiencyLevel: ProficiencyLevel.BEGINNER,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.GERMAN,
        proficiencyLevel: ProficiencyLevel.FLUENT,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.HUNGARIAN,
        proficiencyLevel: ProficiencyLevel.NATIVE,
        capacity: 2,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.GERMAN,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.GERMAN,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 2,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.GERMAN,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
    {
        language: Language.FRENCH,
        proficiencyLevel: ProficiencyLevel.ADVANCED,
        capacity: 1,
        createdAt: "10-09-2022",
        roomId: "cf2382c0-f518-4d7b-b351-8c944ff9b787",
    },
]


const renderRoomsList = (list: Array<RoomState>,filterState: FilterState,clickHandler: (item:RoomState) => any) => {
    if(filterState.filter){
        console.log(`FILTER : ${filterState.language}\t${filterState.proficiencyLevel}\t${filterState.capacity} ${filterState.filter}`)
        list = list.filter(room => room.capacity === filterState.capacity && room.language === filterState.language && room.proficiencyLevel === filterState.proficiencyLevel);
    }

    return list.map((item: RoomState) => {
        // console.log("here")
        // let strList = Object.values(item).join("\t")
        let strList = `${item.language}\t${item.proficiencyLevel}\t${item.capacity}\t${item.createdAt}\t#${item.roomID}`
        return <ListItem disablePadding style={{
            border: "2px solid grey",
            borderRadius: "10px",
            margin: "3px",
            backgroundColor: `rgba(58, 80, 107, 0.8)`,
            wordSpacing: "190px",
            color: '#FFFFFF',
        }}>
            <ListItemButton onClick={()=>clickHandler(item)}>
                <ListItemText
                    primary={strList}/>
            </ListItemButton>
        </ListItem>
    })
}

interface StartPageProps{
    passValuesToParent: (value: RoomState) => void;
}

export const StartPage: React.FC<StartPageProps> = (props) => {

    const [newRoomValue, setNewRoomValue] = React.useState<NewRoomState>({
        language: Language.GERMAN,
        proficiencyLevel: ProficiencyLevel.BEGINNER,
        createdAt: new Date(),
    });

    const dispatch = useAppDispatch();

    const [rooms, setRooms] = React.useState<Array<RoomState>>([]);
    const [filterState, setFilterState] = React.useState<FilterState>({
        language: Language.GERMAN,
        proficiencyLevel: ProficiencyLevel.BEGINNER,
        capacity: 1,
        filter: false,
    });

    const client = useAppSelector(selectClient);
    const accessToken = useAppSelector(selectToken);
    let config: any;
    if (accessToken) {
        config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }
    }
    const navigate = useNavigate();

    const handleRoomClick = (room:RoomState)=>{
        // console.log(JSON.stringify(room));
        props.passValuesToParent(room)
        navigate(`/room/${room.roomID}`);

    }

    const handleNewRoomChange = (prop: keyof NewRoomState) => (event: React.ChangeEvent<HTMLInputElement> | any) => {
        setNewRoomValue({...newRoomValue, [prop]: event.target.value});
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const addRoomHandler = () => {
        setIsModalVisible(false);
        console.log(newRoomValue)
        let payload = {
            id: 10,
            uuid: client.sessionId,
            language: newRoomValue.language,
            proficiencyLevel: newRoomValue.proficiencyLevel,
        }

        axios.post('https://192.168.0.218:8080/api/v1/room/new',
            payload, config,
        ).then((response) => {
                console.log(response.data);
                console.log(response)
                if (response.status === 201) {
                    alert("Room created");
                } else {
                    alert("Server error!");
                }
            }
        ).catch((error) => {
            console.log(error)
            alert(error.response.data.error_message);
        });
    }

    let receiveFilter = (state: FilterState) => {
        console.log(state)
        setFilterState({
            language : state.language,
            proficiencyLevel: state.proficiencyLevel,
            capacity : state.capacity,
            filter: state.filter,
        })
        renderRoomsList(rooms,state,handleRoomClick);
    }

    const user = useAppSelector(selectUser);
    if (!user.isAuthenticated) {
        return <Navigate to={"/login"}/>
    }
    console.log(user)

    const getRooms = () => {
        axios.get('https://192.168.0.218:8080/api/v1/room/all',
            config,
        ).then((response) => {
                // console.log(response)
                if (response.status === 200) {
                    console.log(response.data);
                    let list = [];
                    for (let i = 0; i < response.data.length; i++) {
                        // console.log(response.data[i].entry)
                        list.push(response.data[i].entry)
                    }
                    let roomSet: Set<RoomState> = new Set<RoomState>();

                    list.map((entry: any) => {
                        let roomObj: RoomState = {
                            language: entry.language,
                            proficiencyLevel: entry.proficiencyLevel,
                            capacity: entry.clients.length,
                            createdAt: entry.createdAt,
                            clients: entry.clients.length !== 0 ? entry.clients : [],
                            roomID: entry.roomNumber,
                        }
                        roomSet.add(roomObj);
                        setRooms(Array.from(roomSet));

                    })
                }
            }
        ).catch((error) => {
            console.log(error)
            // alert(error.response.data.error_message);
        });
    }
    // getRooms();
    renderRoomsList(rooms,filterState,handleRoomClick);
    return (
        <div id={"start-page"} style={{
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
            {/*
              border-radius: 7px;
              box-shadow: 0 0 32px rgba(0, 0, 0, .5);
              padding: 40px;
              width: 50px;
              font-size: 26px;
  */}
            <Popup closeOnDocumentClick={false} open={isModalVisible} position="right center">
                <div className={"popup-overlay"}
                     style={{
                         margin: "auto",
                         backgroundColor: "#ffffff",
                         padding: "15px",
                         width: "100%",
                         height: "10rem",
                         display: "flex",
                         justifyContent: "center",
                         outline: "1px solid red",
                         boxShadow: "rgba(0, 0, 0, 0.16) 0px 0px 3px",
                     }}>
                    <div className={"popup-content"}
                         style={{
                             padding: "15px",
                             // outline: "1px solid blue",
                         }}
                    >
                        <TextField id="language-field"
                                   value={newRoomValue.language} label="Language"
                                   onChange={handleNewRoomChange('language')}
                                   select
                                   variant="outlined">
                            {languageOptions()}
                        </TextField>
                        <TextField id="level-field" value={newRoomValue.proficiencyLevel}
                                   onChange={handleNewRoomChange('proficiencyLevel')}
                                   select
                                   label="Current level"
                                   variant="outlined">
                            {levelOptions()}
                        </TextField>
                        <div style={{
                            outline: "1.5px solid black",
                            display: "flex",
                            justifyContent: "space-around",
                            padding: "10px"
                        }}>
                            <ReturnFormButton style={{width: "50%"}} sx={{'&:hover': {outline: "1px solid #5BC0BE"}}}
                                              onClick={addRoomHandler}>Add room</ReturnFormButton>
                            <DiscardFormButton style={{width: "50%"}}
                                               onClick={() => setIsModalVisible(false)}>Cancel</DiscardFormButton>
                        </div>
                    </div>
                </div>
            </Popup>
            <div style={{
                backgroundColor: '#1C2541',
                minHeight: '70vh',
                maxHeight: "80vh",
                minWidth: "80vw",
                maxWidth: "90vw",
                borderRadius: "10px",
                paddingBottom: "10px",
            }}>
                <div id={"filter-addbutton"}
                     style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <RoomFilter sendFilterInput={receiveFilter}/>
                    <div>
                        <AddCircleIcon onClick={() => setIsModalVisible(oldState => !oldState)} style={{
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
                        <RefreshIcon sx={{
                            size: "large",
                            '&:hover': {
                                cursor: "pointer",
                            }
                        }} onClick={() => getRooms()}/>
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
                        marginLeft: "2px",
                        marginRight: "2px",
                        padding: "5px",
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
                        {renderRoomsList(rooms,filterState,handleRoomClick)}
                    </List>
                </div>
            </div>
        </div>
    )
}