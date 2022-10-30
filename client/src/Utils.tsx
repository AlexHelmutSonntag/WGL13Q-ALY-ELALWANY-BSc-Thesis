import axios from "axios";
import {v4 as uuidv4} from 'uuid';
import {Language, ProficiencyLevel} from "./Types";
import {MenuItem} from "@mui/material";
import React from "react";

export const stringToDate = (date:String) => {
    let dd_mm_yyyy = date;
    return  dd_mm_yyyy.replace(/(\d+)\/(\d+)\/(\d+)/g, "$3-$2-$1");
}

export const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


export const validateUsername = (username: string) =>{
    const re = /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/
    return re.test(username);
}

export const validateFullName = (firstName : string, lastName: string) =>{
    return validateName(firstName) && validateName(lastName);
}

export const validateName = (name:string) => {
    const re = /^[A-Z]+[a-z]*/;
    return re.test(name);
}

export const generateUuid = () =>{
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
export const validatePasswordSecurity = (password:string) => {
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


export const fetchUserDetails = (username: string, config: any) => {
    axios.get(`http://192.168.0.218:8080/api/v1/user/${username}`,
        config,
    ).then((response) => {
            console.log(response);
            if (response.status === 200) {
                console.log(response.data);
                return response.data;
                // setUserState(
                //     {
                //         username: response.data.username,
                //         firstName: response.data.firstName,
                //         lastName: response.data.lastName,
                //         gender: response.data.gender,
                //         role: response.data.role,
                //         email: response.data.email,
                //         dob: response.data.dob,
                //         password: response.data.password
                //     }
                // )
                // console.log(`Inside fetch ${userState}`);
            }
        }
    ).catch((error) => console.log(error));
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

export const capacityOptions = () =>{
 return [0, 1, 2].map((capacity) => {
        return <MenuItem value={capacity}>{capacity}</MenuItem>
    });
}