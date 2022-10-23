import React from "react";
import {AuthenticatedUser, Gender, UserState} from "../Types";
import {UserForm} from "./UserForm";
import {ReturnFormButton, RedFormButton, DiscardFormButton} from "./FormButton";
import {Navigate, useNavigate} from 'react-router-dom';
import {validateEmail} from "../Utils";
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

export const AccountSettingsPage: React.FC<AuthenticatedUser> = (props: AuthenticatedUser) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const accessToken = useAppSelector(selectToken);
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
        // console.log(`dob : ${body.dob}`);
        // console.log(`dob : ${body.dob.toLocaleDateString()}`);
        let dd_mm_yyyy = body.dob.toLocaleDateString();
        let dob = dd_mm_yyyy.replace(/(\d+)\/(\d+)\/(\d+)/g, "$3-$2-$1");
        if (validateEmail(body.email)) {
            let payload = {
                firstName: body.firstName,
                lastName: body.lastName,
                password: body.password,
                email: body.email,
                dob: dob,
                gender: body.gender
            }
            axios.put(`https://192.168.0.218:8080/api/v1/user/updateUser/${body.username}`,
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
                        alert("User Updated!");
                    }
                }
            ).catch((error) => console.log(error));
        }
    }

    const deleteUser = (body: any) => {
        axios.delete(`https://192.168.0.218:8080/api/v1/user/${body.username}`,
            config,
        ).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    dispatch(removeUser(""))
                    dispatch(removeToken(""))
                    alert("User deleted!");
                    navigate("/login");
                }
            }
        ).catch((error) => console.log(error));
    }

    return (<div
        style={{backgroundColor: '#3A506B', padding: '10px 10px 10px 10px', minHeight: '85vh'}}>
        <h1 style={{color: "white", padding: '10px 0 0 30px'}}>
            Account Settings for user {props.username}
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
            <p style={{color: "#ff0000", backgroundColor: "#FFFFFF", borderRadius: '5px', padding: '3px'}}>Clicking on
                'Delete account' will delete your account <strong>permanently</strong>.</p>
            <RedFormButton
                onClick={() => deleteUser(userDetails)}
            >
                Delete account
            </RedFormButton>
        </div>
    </div>)
}