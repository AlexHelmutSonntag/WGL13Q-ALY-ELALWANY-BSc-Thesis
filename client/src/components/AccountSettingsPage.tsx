import React from "react";
import {AuthenticatedUser, UpdateUserState, UserState} from "../Types";
import {UserForm} from "./UserForm";
import {ReturnFormButton, RedFormButton, DiscardFormButton} from "./FormButton";
import {Navigate, useNavigate} from 'react-router-dom';
import {validateEmail} from "../Utils";
import axios from "axios";
import {CustomButton} from "./CustomButton";

const redButtonTheme = {
    "background-color": "#FFFFFF",
    "color": "#ff0000",
}

export const AccountSettingsPage : React.FC<AuthenticatedUser> = (userState: AuthenticatedUser) => {
    const navigate = useNavigate();
    let userDetails : UserState;
    if (!userState.isAuthenticated){
        return <Navigate to={"/login"}/>
    }
    let receiveDataFromChild =  (value: UserState)  => {
        userDetails = value;
        console.log(value);
    };

    const updateUserData = (body: any) => {
        let dd_mm_yyyy = body.date.toLocaleDateString();
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
            console.log(`sending data ${body}`)
            axios.put(`http://localhost:8080/api/v1/user/updateUser/${body.username}`,
                payload,
            ).then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        alert("User Updated!");
                    }
                }
            ).catch((error) => console.log(error));
        }
    }

    const deleteUser = (body: any) => {
        axios.delete(`http://localhost:8080/api/v1/user/${body.username}`,
            {},
        ).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    alert("User deleted!");
                    navigate("/logout");
                }
            }
        ).catch((error) => console.log(error));

    }

    return (<div
        style={{backgroundColor: '#3A506B', padding: '10px 10px 10px 10px', minHeight: '85vh'}}>
        <h1 style={{color: "white", padding: '10px 0 0 30px'}}>
            Account Settings
        </h1>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <UserForm firstName={userState.firstName} lastName={userState.lastName} date={userState.date}
                      gender={userState.gender} username={userState.username} email={userState.email} password={""} passValuesToParent={receiveDataFromChild}/>
            <div style={{ marginTop: '20px', marginBottom:'20px'}}>
                <DiscardFormButton
                    onClick={() => navigate(0)}
                >Discard Changes</DiscardFormButton>
                <ReturnFormButton onClick={() =>updateUserData(userDetails)}>
                    Save Changes
                </ReturnFormButton>
            </div>
            <RedFormButton
                onClick={() => deleteUser(userDetails)}
            >
                Delete account
            </RedFormButton>
        </div>
    </div>)
}