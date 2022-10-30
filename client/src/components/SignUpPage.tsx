import React, {useRef, useState} from "react";
import {UserForm} from "./UserForm";
import {Gender, UserState} from "../Types";
import {ReturnFormButton} from "./FormButton";
import {stringToDate, validateEmail, validateFullName, validatePasswordInput, validatePasswordSecurity} from "../Utils";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "../style/SignUpPage.scss"

export const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    let userDetails: UserState;
    const msgDisplayRef = useRef<HTMLDivElement>(null);
    let receiveDataFromChild = (value: UserState) => {
        userDetails = value;
        console.log(value);
    };
    const [signupMsgDisplay, setSignupErrorMessage] = useState<String>("Please follow the rules below");


    const sendSignUpRequest = (body: any) => {
        console.log(msgDisplayRef.current!.classList)
        let dob = stringToDate(body.dob.toLocaleDateString());

        if (!body.firstName || !body.lastName) {
            setSignupErrorMessage('A name cannot be empty');
            msgDisplayRef.current!.classList.add("fail");
        } else if (!validateFullName(body.firstName, body.lastName)) {
            setSignupErrorMessage('The first and last names need to start with an uppercase letter');
            msgDisplayRef.current!.classList.add("fail");
        } else if (!body.username) {
            setSignupErrorMessage('The username cannot be empty');
            msgDisplayRef.current!.classList.add("fail");
        } else if (!validateEmail(body.email)) {
            setSignupErrorMessage('The email is invalid');
            msgDisplayRef.current!.classList.add("fail");
        } else if (!body.password || !body.repeatedPassword) {
            msgDisplayRef.current!.classList.add("fail");
            setSignupErrorMessage('A password cannot be empty');
        } else if (!validatePasswordSecurity(body.password)) {
            setSignupErrorMessage('The password does not follow the rules. Please revise it and enter the password again');
            msgDisplayRef.current!.classList.add("fail");
        } else if (!validatePasswordInput(body.password, body.repeatedPassword)) {
            msgDisplayRef.current!.classList.add("fail");
            setSignupErrorMessage('The passwords inputted do not match');
        }

        if (validateFullName(body.firstName, body.lastName) && validatePasswordSecurity(body.password) && validateEmail(body.email) && validatePasswordInput(body.password, body.repeatedPassword)) {
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
                <div ref={msgDisplayRef} className={"msg-display"}>{signupMsgDisplay}</div>
            </div>

            <div id={"signup-rules"}>
                <ul>
                    Take care
                    <li>Both first and last names must start with an uppercase letter</li>
                    <li>Your email must be of the format : <i>email@example.com</i></li>
                    <li>Your username must be unique.</li>
                    <li>It is advised to use an alphanumeric password that is at least 8 characters long</li>
                </ul>
                <ul>
                    Password rules
                    <li> At least 8 characters long</li>
                    <li> 2 letters in Upper Case</li>
                    <li> 1 Special Character (!@#$&*.)</li>
                    <li> 2 numerals (0-9)</li>
                    <li> 3 letters in Lower Case</li>
                </ul>
            </div>
        </div>
    )
}
