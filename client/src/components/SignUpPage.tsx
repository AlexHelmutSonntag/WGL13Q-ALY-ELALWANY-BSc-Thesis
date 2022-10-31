import React, {useRef, useState} from "react";
import {UserForm} from "./UserForm";
import {Gender, UserState} from "../Types";
import {ReturnFormButton} from "./FormButton";
import {
    stringToDate,
    validateBothNames, validateEmail, validatePasswords, validatePasswordSecurity, validateUsername
} from "../Utils";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "../style/SignUpPage.scss"
import {FormInputMessageContainer} from "./FormInputMessageContainer";

export const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    let userDetails: UserState;
    let receiveDataFromChild = (value: UserState) => {
        userDetails = value;
        console.log(value);
    };
    const msgDisplayRef = useRef<HTMLDivElement>(null);
    const [signupMsgDisplay, setSignupErrorMessage] = useState<String>("Please follow the rules below");


    const sendSignUpRequest = (body: any) => {
        let dob = stringToDate(body.dob.toLocaleDateString());
        if (!validateBothNames(body.firstName, body.lastName, msgDisplayRef, setSignupErrorMessage)) {
            return;
        }
        if (!validateUsername(body.username, msgDisplayRef, setSignupErrorMessage)) {
            return;
        }
        if (!validateEmail(body.email, msgDisplayRef, setSignupErrorMessage)) {
            return;
        }
        if (!validatePasswords(body.password, body.repeatedPassword, msgDisplayRef, setSignupErrorMessage)) {
            return;
        }
        if (!validatePasswordSecurity(body.password, body.repeatedPassword, msgDisplayRef, setSignupErrorMessage)) {
            return;
        }
        let payload = {
            firstName: body.firstName,
            lastName: body.lastName,
            password: body.password,
            email: body.email,
            dob: dob,
            username: body.username,
            gender: body.gender
        }
        console.log(body);
        axios.post('https://192.168.0.218:8080/api/v1/user/new',
            payload,
        ).then((response) => {
                console.log(response.data);
                if (response.status === 201) {
                    msgDisplayRef.current!.classList.remove("fail")
                    msgDisplayRef.current!.classList.add("success")
                    setSignupErrorMessage("User created, redirecting to login")

                    setTimeout(() => {
                        navigate("/login");
                    }, 1600)
                } else {
                    alert("Server error!");
                }
            }
        ).catch((error) => {
            console.log(error)
            setSignupErrorMessage(error.response.data)
        });
    }
    return (
        <div
            style={{backgroundColor: '#1C2541', padding: '10px 10px 10px 10px', minHeight: '85vh'}}>
            <h1 style={{color: "white", padding: '10px 0 0 30px'}}>
                Signup
            </h1>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <UserForm formLabelColor={"#858B97"} textFieldBackgroundColor={"#3A506BB2"} firstName={""} lastName={""}
                          dob={new Date("2000-01-01")}
                          gender={Gender.MALE} username={""} email={""} password={""}
                          passValuesToParent={receiveDataFromChild}/>
                <div style={{marginTop: "10px"}} id={"form-signup-button"}>
                    <ReturnFormButton
                        onClick={() => sendSignUpRequest(userDetails)}
                    >Sign Up</ReturnFormButton>
                </div>
                <span style={{color: "rgba(255, 255, 255, 0.7)", paddingBottom: "20px", paddingTop: "10px"}}>Already have an account ? <a
                    href="/login"
                    style={{paddingLeft: '2px', fontWeight: "bold", color: "#5BC0BE"}}>Sign in</a></span>
                <div ref={msgDisplayRef} className={"msg-display-signup"}>{signupMsgDisplay}</div>
            </div>
            <FormInputMessageContainer/>
        </div>
    )
}
