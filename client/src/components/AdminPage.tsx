import React from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {selectUser} from "../feature/user/userSlice";
import {FilterState, Language, ProficiencyLevel, Role, RoomState, UserState} from "../Types";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import {DiscardFormButton, RedFormButton} from "./FormButton";
import axios from "axios";
import {selectToken} from "../feature/token/tokenSlice";
import {getRooms, renderRoomsTable} from "../Utils";
import {addRoom, removeAllRooms} from "../feature/rooms/roomsSlice";

type UserProps = Pick<UserState, "username" | "firstName" | "lastName" | "role">;
const renderUsersTable = (list: Array<UserProps>, clickHandler: (item: UserProps) => any) => {
    return (<TableContainer component={Paper}>
        <Table sx={{minWidth: 1000}} aria-label="rooms table">
            <TableHead>
                <TableRow
                    sx={{
                        backgroundColor: `#1C2541`,
                        '& .MuiTableCell-root': {
                            color: '#FFFFFF',
                        },
                        border: "2px solid grey",
                    }}
                >
                    <TableCell align="center">Username</TableCell>
                    <TableCell align="center">First name</TableCell>
                    <TableCell align="center">Last name</TableCell>
                    <TableCell align="center">Role</TableCell>
                </TableRow>
                {list.map((item: UserProps) => (
                    <TableRow key={item.username}
                              sx={{
                                  backgroundColor: `#141931`,
                                  border: "2px solid grey",
                                  '&:last-child td, &:last-child th': {
                                      border: 0,
                                  },
                                  '&:hover': {
                                      cursor: "pointer",
                                      backgroundColor: "#DBE4EE",
                                      '& .MuiTableCell-root': {
                                          color: '#000000',
                                      },
                                  },
                                  '& .MuiTableCell-root': {
                                      color: '#FFFFFF',
                                  },
                              }}
                              onClick={() => clickHandler(item)}
                    >
                        <TableCell align="center">{item.username}</TableCell>
                        <TableCell align="center">{item.firstName}</TableCell>
                        <TableCell align="center">{item.lastName}</TableCell>
                        <TableCell align="center">{item.role}</TableCell>
                    </TableRow>
                ))}
            </TableHead>
        </Table>
    </TableContainer>)
}


export const AdminPage: React.FC = (props) => {
    const [users, setUsers] = React.useState<Array<UserProps>>([]);
    const [userDetails, setUser] = React.useState<UserProps | null>(null);
    const [roomDetails, setRoom] = React.useState<RoomState | null>(null);
    const [openDeleteAccountPopup, setOpenDeleteAccountPopup] = React.useState(false);
    const [openDeleteRoomPopup, setOpenDeleteRoomPopup] = React.useState(false);
    const [rooms, setRooms] = React.useState<Array<RoomState>>([]);
    const accessToken = useAppSelector(selectToken);
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

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
    const [filterState, setFilterState] = React.useState<FilterState>({
        language: Language.GERMAN,
        proficiencyLevel: ProficiencyLevel.BEGINNER,
        capacity: 1,
        filter: false,
    });

    const deleteUser = (body: any, config: any) => {
        console.log(JSON.stringify(body))
        axios.delete(`https://192.168.0.218:8080/api/v1/user/${body.username}`,
            config,
        ).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    handleCloseUserDialog()
                    getUsers()
                }
            }
        ).catch((error) => console.log(error));
    }
    const deleteRoom = (room: any, config: any) => {

        console.log(JSON.stringify(room))
        axios.delete(`https://192.168.0.218:8080/api/v1/room/${room.roomID}`,
            config,
        ).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    handleClickCloseRoomDialog()
                    roomsRefreshHandler().then(() => console.log(`Rooms synced`)).catch((err)=> console.log(`Error syncing rooms ${err}`));
                }
            }
        ).catch((error) => {
            console.log(error)

            if(error.response.status===403){
                alert(`Token expired! request status : ${error.response.data}`);
            }
        });
    }
    const handleUserClick = (user: UserProps) => {
        setUser(user)
        console.log(user);
        handleClickOpenUserDialog();
    }
    const handleRoomClick = (room:RoomState) =>{
        setRoom(room)
        let roomEmpty = (room?.capacity ?? 0) === 0;
        if (!roomEmpty) {
            alert("Room is not empty");
            return;
        }
        handleClickOpenRoomDialog();
    }

    const handleClickOpenRoomDialog = () => {
        setOpenDeleteRoomPopup(true);
    };
    const handleClickCloseRoomDialog = () => {
        setOpenDeleteRoomPopup(false);
    };

    const handleClickOpenUserDialog = () => {
        setOpenDeleteAccountPopup(true);
    };

    const handleCloseUserDialog = () => {
        setOpenDeleteAccountPopup(false);
    };

    const user = useAppSelector(selectUser);

    if (!user.isAuthenticated) {
        return <Navigate to={"/login"}/>
    } else if (user.isAuthenticated && user.role !== Role.ADMIN) {
        return <Navigate to={"/start"}/>

    }

    const getUsers = () => {
        axios.get('https://192.168.0.218:8080/api/v1/user/all',
            config,
        ).then((response) => {
            if (response.status === 200) {
                let userSet: Set<UserProps> = new Set<UserProps>();
                for (let i = 0; i < response.data.length; i++) {
                    console.log(response.data[i])
                    let userObject: UserProps = {
                        username: response.data[i].username,
                        firstName: response.data[i].firstName,
                        lastName: response.data[i].lastName,
                        role: response.data[i].role,
                    }
                    userSet.add(userObject)
                }
                setUsers(Array.from(userSet));
            } else {
                console.log(`Here ${response.status}`);
            }
        }).catch((error) => {
            if (error.response.status === 403) {
                console.log(error.response);
                alert('Your login token expired, please logout and login again.');
            }
        });
    }

    renderUsersTable(users, handleUserClick);
    return (
        <div id={"start-page"} style={{
            backgroundColor: '#1C2541',
            padding: '10px 10px 10px 10px',
            minHeight: '95vh',
            minWidth: '85vw',
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
        }}>
            <h1 style={{color: "#FFFFFF"}}>
                Admin panel
            </h1>
            <h2 style={{color: "#FFFFFF"}}>You are logged in as {user.username}</h2>
            <h3 style={{
                color: "white",
                fontWeight: "bold",
                fontSize:"x-large",
                padding: "5px",
                backgroundColor: "rgba(51, 70, 97, 0.51)",
                borderColor: "#6b6c7d",
                borderRadius: "5px",
                borderStyle: "solid",
                textAlign: "center",
                width: "10%",
            }}>Users</h3>
            <div style={{
                backgroundColor: '#354d62',
                minHeight: '40vh',
                maxHeight: "80vh",
                minWidth: "80vw",
                maxWidth: "90vw",
                borderRadius: "10px",
                paddingBottom: "10px",
            }}>
                <div id={"refresh-users"}
                     style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div>
                        <RefreshIcon sx={{
                            fontSize: "xxx-large",
                            marginRight: "10px",
                            color: "#FFFFFF",
                            '&:hover': {
                                cursor: "pointer",
                            }
                        }} onClick={() => getUsers()}/>
                    </div>

                </div>
                <div id="room-section" style={{
                    overflowY: "scroll",
                    maxHeight: '70vh',
                    paddingBottom: '1px',
                }}>
                    {renderUsersTable(users, handleUserClick)}
                </div>
                <Dialog
                    open={openDeleteAccountPopup}
                    onClose={handleCloseUserDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {`You are about to delete the account of ${userDetails?.username}.`}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Do you want to delete this account?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <DiscardFormButton onClick={handleCloseUserDialog}>No</DiscardFormButton>
                        <RedFormButton onClick={() => deleteUser(userDetails, config)} autoFocus>
                            Yes
                        </RedFormButton>
                    </DialogActions>
                </Dialog>

            </div>
            <br/>
            <h3 style={{
                color: "white",
                fontWeight: "bold",
                fontSize:"x-large",
                padding: "5px",
                backgroundColor: "rgba(51, 70, 97, 0.51)",
                borderColor: "#6b6c7d",
                borderRadius: "5px",
                borderStyle: "solid",
                textAlign: "center",
                width: "10%",
            }}>Rooms</h3>
            <div style={{
                backgroundColor: '#354d62',
                minHeight: '40vh',
                maxHeight: "80vh",
                minWidth: "80vw",
                maxWidth: "90vw",
                borderRadius: "10px",
                paddingBottom: "10px",
            }}>
                <div id={"refresh-rooms"}
                     style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div>
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
                <div id="rooms-section" style={{
                    overflowY: "scroll",
                    maxHeight: '70vh',
                    paddingBottom: '1px',
                }}>
                    {renderRoomsTable(rooms, filterState, handleRoomClick)}
                </div>
                <Dialog
                    open={openDeleteRoomPopup}
                    onClose={handleClickCloseRoomDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {`You are about to delete the room #${roomDetails?.roomID}.`}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Do you want to delete this room?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <DiscardFormButton onClick={handleClickCloseRoomDialog}>No</DiscardFormButton>
                        <RedFormButton onClick={() => deleteRoom(roomDetails, config)} autoFocus>
                            Yes
                        </RedFormButton>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}