import React, {useState} from "react";
import {Navigate, redirect, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {selectUser} from "../feature/user/userSlice";
import {RoomFilter} from "./RoomFilter";
import {FilterState, Gender, Language, NewRoomState, ProficiencyLevel, RoomState, UserState} from "../Types";
import {
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    ListItem,
    ListItemButton,
    ListItemText, Paper, Table, TableCell, TableContainer, TableHead, TableRow,
    TextField,
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import {DiscardFormButton, ReturnFormButton} from "./FormButton";
import axios from "axios";
import {selectClient} from "../feature/client/clientSlice";
import {selectToken} from "../feature/token/tokenSlice";
import {getRooms, languageOptions, levelOptions, renderRoomsTable} from "../Utils";
import {addRoom, removeAllRooms, selectRooms} from "../feature/rooms/roomsSlice";


const renderRoomsList = (list: Array<RoomState>, filterState: FilterState, clickHandler: (item: RoomState) => any) => {
    if (filterState.filter) {
        console.log(`FILTER : ${filterState.language}\t${filterState.proficiencyLevel}\t${filterState.capacity} ${filterState.filter}`)
        list = list.filter(room => room.capacity === filterState.capacity && room.language === filterState.language && room.proficiencyLevel === filterState.proficiencyLevel);
    }

    return list.map((item: RoomState) => {
        let strList = `${item.language}\t${item.proficiencyLevel}\t${item.capacity}\t${item.createdAt}\t#${item.roomID}`
        return <ListItem disablePadding style={{
            border: "2px solid grey",
            borderRadius: "10px",
            margin: "3px",
            backgroundColor: `rgba(58, 80, 107, 0.8)`,
            color: '#FFFFFF',
            wordSpacing: "190px",
        }}>
            <ListItemButton onClick={() => clickHandler(item)}>
                <ListItemText
                    primary={strList}/>
            </ListItemButton>
        </ListItem>
    })
}

interface StartPageProps {
    passValuesToParent: (value: RoomState) => void;
}

export const StartPage: React.FC<StartPageProps> = (props) => {

    const [newRoomValue, setNewRoomValue] = React.useState<NewRoomState>({
        language: Language.GERMAN,
        proficiencyLevel: ProficiencyLevel.BEGINNER,
        createdAt: new Date(),
    });
    const [rooms, setRooms] = React.useState<Array<RoomState>>([]);
    const [openCreateRoomDialog, setOpenCreateRoomDialog] = React.useState(false);
    const roomsInStore = useAppSelector(selectRooms)
    const dispatch = useAppDispatch()

    const [filterState, setFilterState] = React.useState<FilterState>({
        language: Language.GERMAN,
        proficiencyLevel: ProficiencyLevel.BEGINNER,
        capacity: 1,
        filter: false,
    });

    const handleClose = () => {
        setOpenCreateRoomDialog(false);
    };

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
    const roomsRefreshHandler = async () => {
        let roomsList = await getRooms(config)
        let roomSet: Set<RoomState> = new Set<RoomState>();
        dispatch(removeAllRooms)
        if (roomsList !== undefined) {
            roomsList.map(room => {
                roomSet.add(room);
                dispatch(addRoom(room))
                console.log(`${JSON.stringify(room)}`)
            })
        }
        setRooms(Array.from(roomSet));
    }
    const navigate = useNavigate();

    const handleRoomClick = (room: RoomState) => {
        props.passValuesToParent(room)
        let roomFull = (room?.capacity ?? 0) >= 2;
        if (roomFull) {
            alert("Room is full!");
            return;
        }
        navigate(`/room/${room.roomID}`);
    }

    const handleNewRoomChange = (prop: keyof NewRoomState) => (event: React.ChangeEvent<HTMLInputElement> | any) => {
        setNewRoomValue({...newRoomValue, [prop]: event.target.value});
    }

    const addRoomHandler = () => {
        setOpenCreateRoomDialog(false);
        console.log(newRoomValue)
        let payload = {
            id: 10, // dummy id -> in server the ids are fetched based on the current count of rooms.
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
                    roomsRefreshHandler();
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
            language: state.language,
            proficiencyLevel: state.proficiencyLevel,
            capacity: state.capacity,
            filter: state.filter,
        })
    }

    const user = useAppSelector(selectUser);
    if (!user.isAuthenticated) {
        return <Navigate to={"/login"}/>
    }
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
            <Dialog
                open={openCreateRoomDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Choose the language and the level of the room"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div className={"popup-content"}
                             style={{
                                 minWidth: "20rem",
                                 padding: "15px",
                                 margin: "15px",
                                 display: "flex",
                                 justifyContent: "space-evenly"
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
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <DiscardFormButton style={{width: "50%"}} onClick={handleClose}>Cancel</DiscardFormButton>
                    <ReturnFormButton style={{width: "50%"}} sx={{'&:hover': {outline: "1px solid #5BC0BE"}}}
                                      onClick={addRoomHandler} autoFocus>Create room
                    </ReturnFormButton>
                </DialogActions>
            </Dialog>
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
                        <AddCircleIcon onClick={() => setOpenCreateRoomDialog(oldState => !oldState)} style={{
                            color: "#5BC0BE",
                            marginRight: "10px",
                            borderRadius: "30px",
                            fontSize: "xxx-large",
                        }} sx={{
                            '&:hover': {
                                cursor: "pointer",
                            }
                        }}
                        />
                        <RefreshIcon sx={{
                            fontSize: "xxx-large",
                            marginRight: "10px",
                            color: "#FFFFFF",
                            '&:hover': {
                                cursor: "pointer",
                            }
                        }} onClick={() => roomsRefreshHandler()}/>
                    </div>
                </div>
                <div id="room-section" style={{
                    overflowY: "scroll",
                    maxHeight: '70vh',
                    paddingBottom: '1px',
                }}>
                    {renderRoomsTable(rooms, filterState, handleRoomClick)}
                </div>
            </div>
        </div>
    )
}