import React from "react";
import {UserForm} from "./UserForm";
import {Gender, UserState} from "../Types";
import {ReturnFormButton} from "./FormButton";
import {stringToDate, validateEmail, validateFullName, validatePasswordInput} from "../Utils";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    let userDetails: UserState;

    let receiveDataFromChild = (value: UserState) => {
        userDetails = value;
        console.log(value);
    };

    const sendSignUpRequest = (body: any) => {
        let dob = stringToDate(body.dob.toLocaleDateString());
        if (!validateFullName(body.firstName, body.lastName)) {
            alert('The first and last names need to start with an uppercase letter');
        }
        if (!validateEmail(body.email) && !validatePasswordInput(body.password, body.repeatedPassword)) {
            alert('The email you inputted is invalid and the passwords do not match!')
        } else if (!validatePasswordInput(body.password, body.repeatedPassword)) {
            alert('The passwords you inputted do not match!')
        } else if (!validateEmail(body.email)) {
            alert('The email you inputted is invalid!')
        }
        if (validateFullName(body.firstName, body.lastName) && validateEmail(body.email) && validatePasswordInput(body.password, body.repeatedPassword)) {
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
            axios.post('http://localhost:8080/api/v1/user/new',
                payload,
            ).then((response) => {
                    console.log(response.data);
                    if (response.status === 201) {
                        alert("User created, try your credentials..");
                        navigate("/login");
                    } else {
                        alert("Server error!");
                    }
                }
            ).catch((error) => {
                console.log(error)
                alert(error.response.data);
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
            </div>
        </div>
    )
}
