import {v4 as uuidv4} from 'uuid';
import {FilterState, Language, ProficiencyLevel, RoomState} from "./Types";
import {MenuItem, Paper, Table, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import axios, {AxiosError, AxiosResponse} from "axios";
import {addRoom, removeAllRooms} from "./feature/rooms/roomsSlice";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export const stringToDate = (date: String) => {
    let dd_mm_yyyy = date;
    return dd_mm_yyyy.replace(/(\d+)\/(\d+)\/(\d+)/g, "$3-$2-$1");
}

export const isValidEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


export const isValidUsername = (username: string) => {
    const re = /^[a-zA-Z0-9]+([_.-]?[a-zA-Z0-9])*$/
    return re.test(username);
}

export const validateFullName = (firstName: string, lastName: string) => {
    return validateName(firstName) && validateName(lastName);
}

export const validateName = (name: string) => {
    const re = /^[A-Z]+[a-z]*/;
    return re.test(name);
}

export const generateUuid = () => {
    return uuidv4();
}

/*
Password strength criteria is as below :
    8 characters length
    2 letters in Upper Case
    1 Special Character (!@#$&*)
    2 numerals (0-9)
    3 letters in Lower Case
 */
export const isPasswordSecure = (password: string) => {
    /*
    ^                         Start anchor
    (?=.*[A-Z].*[A-Z])        Ensure string has two uppercase letters.
    (?=.*[!@#$&*])            Ensure string has one special case letter.
    (?=.*[0-9].*[0-9])        Ensure string has two digits.
    (?=.*[a-z].*[a-z].*[a-z]) Ensure string has three lowercase letters.
    .{8}                      Ensure string is of length 8.
    $                         End anchor.
     */
    const re = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*.])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;
    return re.test(password);
}


export const validatePasswordInput = (password: string, repeatedPassword: string): boolean => {
    if (password === "" || repeatedPassword === "") {
        return false;
    }
    return password.trim() === repeatedPassword.trim();
}


export const levelOptions = () => {
    let list = [];
    for (let level in ProficiencyLevel) {
        list.push(level)
    }
    return list.map(level => <MenuItem value={level}>{level}</MenuItem>);
}

export const languageOptions = () => {
    let list = [];
    for (let language in Language) {
        list.push(language)
    }
    return list.map(language => <MenuItem value={language}>{language}</MenuItem>);
}

export const capacityOptions = () => {
    return [0, 1, 2].map((capacity) => {
        return <MenuItem value={capacity}>{capacity}</MenuItem>
    });
}

export const validateBothNames = (firstName: string, lastName: string, msgDisplayRef: React.RefObject<HTMLDivElement>, setErrorMessage: React.Dispatch<React.SetStateAction<String>>) => {
    if (!firstName || !lastName) {
        setErrorMessage('A name cannot be empty');
        msgDisplayRef.current!.classList.add("fail");
        return false;
    }
    if (!validateFullName(firstName, lastName)) {
        setErrorMessage('The first and last names need to start with an uppercase letter');
        msgDisplayRef.current!.classList.add("fail");
        return false;
    }
    return true;
}
export const validateUsername = (username: string, msgDisplayRef: React.RefObject<HTMLDivElement>, setErrorMessage: React.Dispatch<React.SetStateAction<String>>) => {
    if (!isValidUsername(username)) {
        setErrorMessage('The username cannot be empty');
        msgDisplayRef.current!.classList.add("fail");
        return false;
    }
    return true;
}
export const validateEmail = (email: string, msgDisplayRef: React.RefObject<HTMLDivElement>, setErrorMessage: React.Dispatch<React.SetStateAction<String>>) => {
    if (!isValidEmail(email)) {
        setErrorMessage('The email is invalid');
        msgDisplayRef.current!.classList.add("fail");
        return false;
    }
    return true;
}

export const validatePasswords = (password: string, repeatedPassword: string, msgDisplayRef: React.RefObject<HTMLDivElement>, setErrorMessage: React.Dispatch<React.SetStateAction<String>>) => {
    if (!password || !repeatedPassword) {
        setErrorMessage('A password cannot be empty');
        msgDisplayRef.current!.classList.add("fail");
        return false;
    }
    if (password.trim() !== repeatedPassword.trim()) {
        console.log(password.trim())
        console.log(repeatedPassword.trim())
        setErrorMessage('The passwords inputted do not match');
        msgDisplayRef.current!.classList.add("fail");
        return false;
    }
    return true;
}

export const validatePasswordSecurity = (password: string, repeatedPassword: string, msgDisplayRef: React.RefObject<HTMLDivElement>, setErrorMessage: React.Dispatch<React.SetStateAction<String>>) => {
    if (!isPasswordSecure(password) && !isPasswordSecure(repeatedPassword)) {
        setErrorMessage('The password does not follow the rules. Please revise it and enter the password again');
        msgDisplayRef.current!.classList.add("fail");
        return false;
    }
    return true;
}


export const getRooms = async (config: any) => {
    try {
        let response = await axios.get('https://192.168.0.218:8080/api/v1/room/all',
            config);
        let list = [];

        if (response.status === 200) {
            for (let i = 0; i < response.data.length; i++) {
                // console.log(response.data[i].entry)
                list.push(response.data[i].entry)
            }
            let roomsList : Array<RoomState> = new Array<RoomState>();
            list.map((entry: any) => {
                let roomObj: RoomState = {
                    language: entry.language,
                    proficiencyLevel: entry.proficiencyLevel,
                    capacity: entry.clients.length,
                    createdAt: entry.createdAt,
                    clients: entry.clients.length !== 0 ? entry.clients : [],
                    roomID: entry.roomNumber,
                }
                roomsList.push(roomObj);
            });
            return roomsList;
        } else {
            console.log(`Here ${response.status}`);
        }
    } catch (error:any) {
        if (error.response.status === 403) {
            console.log(error.response);
            alert('Your login token expired, please logout and login again.');
        }
    }

}

export const filterRooms = (list: Array<RoomState>, filterState: FilterState) => {
    return list.filter(room => room.capacity === filterState.capacity && room.language === filterState.language && room.proficiencyLevel === filterState.proficiencyLevel);
}
export const renderRoomsTable = (list: Array<RoomState>, filterState: FilterState, clickHandler: (item: RoomState) => any) => {
    if (filterState.filter) {
        console.log(`FILTER : ${filterState.language}\t${filterState.proficiencyLevel}\t${filterState.capacity} ${filterState.filter}`)
        list = filterRooms(list, filterState);
    }

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
                    <TableCell align="center">Language</TableCell>
                    <TableCell align="center">Level</TableCell>
                    <TableCell align="center">Users inside</TableCell>
                    <TableCell align="center">Created</TableCell>
                    <TableCell align="center">Room ID</TableCell>
                </TableRow>
                {list.map((item: RoomState) => (
                    <TableRow key={item.language}
                              sx={{
                                  backgroundColor: `#3A506B`,
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
                        <TableCell align="center">{item.language}</TableCell>
                        <TableCell align="center">{item.proficiencyLevel}</TableCell>
                        <TableCell align="center">{item.capacity}</TableCell>
                        <TableCell align="center">{item.createdAt.toString()}</TableCell>
                        <TableCell align="center">{item.roomID}</TableCell>
                    </TableRow>
                ))}
            </TableHead>
        </Table>
    </TableContainer>)
}


