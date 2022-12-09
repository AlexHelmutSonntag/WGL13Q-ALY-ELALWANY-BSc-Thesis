import React from "react";
import {Navigate} from "react-router-dom";
import {useAppSelector} from "../store/hooks";
import {selectUser} from "../feature/user/userSlice";
import {Role, UserState} from "../Types";
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
    // let userDetails: UserProps;
    const [users, setUsers] = React.useState<Array<UserProps>>([]);
    const [userDetails, setUser] = React.useState<UserProps | null>(null);
    const [openDeleteAccountPopup, setOpenDeleteAccountPopup] = React.useState(false);
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
    const deleteUser = (body: any, config: any) => {
        console.log(JSON.stringify(body))
        axios.delete(`https://192.168.0.218:8080/api/v1/user/${body.username}`,
            config,
        ).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    handleClose()
                    getUsers()
                }
            }
        ).catch((error) => console.log(error));
    }
    const handleUserClick = (user: UserProps) => {
        setUser(user)
        // userDetails = user;
        console.log(user);
        handleClickOpen();
    }

    const handleClickOpen = () => {
        setOpenDeleteAccountPopup(true);
    };

    const handleClose = () => {
        setOpenDeleteAccountPopup(false);
    };
    const user = useAppSelector(selectUser);
    if (user.isAuthenticated && user.role !== Role.ADMIN) {
            return <Navigate to={"/start"}/>
    }else if(!user.isAuthenticated){
        return <Navigate to={"/login"}/>
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
                    onClose={handleClose}
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
                        <DiscardFormButton onClick={handleClose}>No</DiscardFormButton>
                        <RedFormButton onClick={() => deleteUser(userDetails, config)} autoFocus>
                            Yes
                        </RedFormButton>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}