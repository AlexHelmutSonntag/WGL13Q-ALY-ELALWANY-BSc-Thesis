import React, {useRef, useState} from "react";
import {AuthenticatedUser, Gender, UserState} from "../Types";
import {UserForm} from "./UserForm";
import {ReturnFormButton, RedFormButton, DiscardFormButton} from "./FormButton";
import {Navigate, useNavigate} from 'react-router-dom';
import {
    validateBothNames,
    validateEmail, validatePasswords, validatePasswordSecurity
} from "../Utils";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {
    removeUser,
    selectUser,
    setDOB,
    setEmail,
    setFirstname,
    setGender,
    setLastname,
} from "../feature/user/userSlice";
import {removeToken, selectToken} from "../feature/token/tokenSlice";
import {FormInputMessageContainer} from "./FormInputMessageContainer";
import "../style/AccountSettingsPage.scss"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

export const AccountSettingsPage: React.FC<AuthenticatedUser> = (props: AuthenticatedUser) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const accessToken = useAppSelector(selectToken);
    const msgDisplayRef = useRef<HTMLDivElement>(null);
    const [updateUserMessage, setUpdateUserMessage] = useState<String>("Please follow the rules below when updating your account data");
    const [openDeleteAccountPopup, setOpenDeleteAccountPopup] = React.useState(false);

    const handleClickOpen = () => {
        setOpenDeleteAccountPopup(true);
    };

    const handleClose = () => {
        setOpenDeleteAccountPopup(false);
    };

    if (!user.isAuthenticated) {
        return <Navigate to={"/login"}/>
    }

    let userDetails: UserState;

    let receiveDataFromChild = (value: UserState) => {
        userDetails = value;
    };

    let config: any;
    if (accessToken) {
        config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }
    }
    const updateUserData = (body: any) => {
        let dd_mm_yyyy = body.dob.toLocaleDateString();
        let dob = dd_mm_yyyy.replace(/(\d+)\/(\d+)\/(\d+)/g, "$3-$2-$1");

        if (!validateBothNames(body.firstName, body.lastName, msgDisplayRef, setUpdateUserMessage)) {
            return;
        }
        if (!validateEmail(body.email, msgDisplayRef, setUpdateUserMessage)) {
            return;
        }
        if (body.password || body.repeatedPassword) {
            if (!validatePasswords(body.password, body.repeatedPassword, msgDisplayRef, setUpdateUserMessage)) {
                return;
            }
            if (!validatePasswordSecurity(body.password, body.repeatedPassword, msgDisplayRef, setUpdateUserMessage)) {
                return;
            }
        }

        let payload = {
            firstName: body.firstName,
            lastName: body.lastName,
            password: body.password,
            email: body.email,
            dob: dob,
            gender: body.gender
        }
        axios.put(`https://192.168.0.218:8080/api/v1/user/updateUser/${user.username}`,
            payload,
            config,
        ).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    dispatch(setFirstname(payload.firstName))
                    dispatch(setLastname(payload.lastName))
                    dispatch(setEmail(payload.email))
                    dispatch(setGender(payload.gender))
                    dispatch(setDOB(payload.dob))
                    msgDisplayRef.current!.classList.remove("fail")
                    msgDisplayRef.current!.classList.add("success")
                    setUpdateUserMessage("User Updated!")
                }else{

                }
            }
        ).catch((error) => {
            console.log(error)
            setUpdateUserMessage(error.response.data.error_message);
            msgDisplayRef.current!.classList.add("fail");
            msgDisplayRef.current!.classList.remove("success")
        });
    }

    const deleteUser = (body: any) => {
        axios.delete(`https://192.168.0.218:8080/api/v1/user/${body.username}`,
            config,
        ).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    dispatch(removeUser(""))
                    dispatch(removeToken(""))
                    setOpenDeleteAccountPopup(false);
                    msgDisplayRef.current!.classList.remove("fail")
                    msgDisplayRef.current!.classList.add("success")
                    setUpdateUserMessage("User deleted!")
                    navigate("/login");
                }
            }
        ).catch((error) => console.log(error));
    }

    return (<div
        style={{backgroundColor: '#3A506B', padding: '10px 10px 10px 10px', minHeight: '85vh'}}>
        <h1 style={{color: "white", padding: '10px 0 0 30px'}}>
            Account Settings for user <i> {props.username}</i>
        </h1>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <UserForm formLabelColor={"#858B97"} textFieldBackgroundColor={'rgba(28,37,65,0.3)'}
                      firstName={props.firstName} lastName={props.lastName} dob={props.dob}
                      gender={props.gender as Gender} username={props.username} email={props.email}
                      password={""}
                      passValuesToParent={receiveDataFromChild}/>
            <div style={{marginTop: '20px', marginBottom: '20px'}}>
                <DiscardFormButton
                    onClick={() => navigate(0)}
                >Discard Changes</DiscardFormButton>
                <ReturnFormButton onClick={() => updateUserData(userDetails)}>
                    Save Changes
                </ReturnFormButton>
            </div>
            <RedFormButton variant="outlined" onClick={handleClickOpen}>
                Delete account
            </RedFormButton>
            <Dialog
                open={openDeleteAccountPopup}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"You are about to delete your account."}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Delete your account permanently?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <DiscardFormButton onClick={handleClose}>No</DiscardFormButton>
                    <RedFormButton onClick={() => deleteUser(userDetails)} autoFocus>
                        Yes
                    </RedFormButton>
                </DialogActions>
            </Dialog>
            <div ref={msgDisplayRef} className={"msg-display-settings"}>{updateUserMessage}</div>
        </div>
        <FormInputMessageContainer/>
    </div>)
}