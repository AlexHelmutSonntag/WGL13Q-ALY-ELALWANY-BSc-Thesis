import React, {useRef, useState} from "react";
import qs from 'qs';
import {Navigate, useNavigate} from 'react-router-dom';
import "../style/SignInPage.scss";
import {
    Box,
    Container,
    FormControl, IconButton, InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {ReturnFormButton} from "./FormButton";
import {LoginState, UpdateUserState} from "../Types";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {selectToken, setToken} from "../feature/token/tokenSlice";
import {
    selectUser, setAuthenticated,
    setDOB,
    setEmail,
    setFirstname,
    setGender,
    setLastname,
    setRole,
    setUsername
} from "../feature/user/userSlice";

interface LoginProps {
    isAuthenticated?: boolean;
    changeLoginState: (value: boolean, username: string, user: UpdateUserState) => void;
}

export const SignInPage: React.FC<LoginProps> = (props) => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser);
    const [displayMsg, setDisplayMsg] = React.useState<String>("");
    const displayMsgRef = useRef<HTMLDivElement>(null);

    const [values, setValues] = React.useState<LoginState>({
        email: '',
        username: '',
        password: '',
        validEmail: false,
        showPassword: false,
    });

    if (user.isAuthenticated) {
        return <Navigate to={"/start"}/>
    }

    const handleChange =
        (prop: keyof Partial<LoginState>) => (event: React.ChangeEvent<HTMLInputElement> | any) => {

            setValues({...values, [prop]: event.target.value});
        };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const sendSignInRequest: any = async (body: any) => {

        if (body.password.trim() !== "") {
            let params: any = {
                username: body.username.trim(), password: body.password.trim()
            }
            await axios({
                method: 'post',
                url: 'https://192.168.0.218:8080/login',
                headers: {'content-type': 'application/x-www-form-urlencoded',},
                data: qs.stringify(params),
            }).then(response => {

                console.log(`Login response:\n ${JSON.stringify(response.data)}`);
                if (response.data.access_token && response.data.refresh_token&&response.status===200) {
                    dispatch(setToken(response.data.access_token));
                    dispatch(setAuthenticated(true));
                    console.log(`From store :${user.username} \n`);
                    let config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${response.data.access_token}`
                        }
                    }
                    fetchUserDetails(params.username, config);
                    console.log("hi")
                    navigate("/account");
                }
            }).catch(err => {
                console.log(err)
                let statusCode = err.response.status
                displayMsgRef.current!.style.display="block";
                displayMsgRef.current!.style.borderColor="red";
                if (statusCode === 403) {
                    setDisplayMsg("Wrong username or password!")
                }else{
                    setDisplayMsg(err.message)
                }
            });
        }
    }

    const fetchUserDetails = (username: string, config: any) => {
        axios.get(`https://192.168.0.218:8080/api/v1/user/${username}`,
            config,
        ).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    dispatch(setFirstname(response.data.firstName));
                    dispatch(setLastname(response.data.lastName));
                    dispatch(setUsername(response.data.username));
                    dispatch(setEmail(response.data.email));
                    dispatch(setGender(response.data.gender));
                    dispatch(setRole(response.data.role));
                    dispatch(setDOB(response.data.dob));
                    dispatch(setAuthenticated(true));
                }
            }
        ).catch((error) => console.log(error));
    }


    return (
        <div style={{backgroundColor: '#3A506B', padding: '10px 10px 10px 10px', minHeight: '80vh'}}>
            <div
                style={{
                    backgroundColor: '#1C2541',
                    paddingLeft: '50px',
                    paddingTop: '10px',
                    borderRadius: '5px',
                    minHeight: '85vh'
                }}>
                <h1 style={{color: "white", paddingTop: '10px'}}>
                    Log In
                </h1>
                <Container sx={{
                    '& .MuiBox-root': {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    },
                }}>
                    <Box component={"form"} sx={{
                        '& .MuiTextField-root': {
                            m: 1,
                            width: '25ch',
                            backgroundColor: 'rgba(58, 80, 107, 0.7)',
                            display: 'flex',
                            borderRadius: '5px',
                            marginTop: 1,
                            marginBottom: 1,
                            borderColor: 'rgba(58, 80, 107, 0.7)',
                            color: '#4A5B70',
                            '&:hover': {
                                borderColor: 'transparent',
                            },
                            '& .MuiFormLabel-root': {
                                color: "#858B97",
                            },

                        },
                    }}>

                        <TextField
                                   required id="username-input" value={values.username}
                                   onChange={handleChange('username')} label="Username"
                                   variant="outlined"/>
                        <FormControl
                            sx={{
                                m: 1,
                                width: '25ch',
                                backgroundColor: 'rgba(58, 80, 107, 0.7)',
                                borderRadius: '5px',
                                '& .MuiFormLabel-root': {
                                    color: "#858B97",
                                },
                            }}
                            variant="outlined">
                            <InputLabel required htmlFor="password-input">Password</InputLabel>
                            <OutlinedInput
                                required
                                id="password-input"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        <div id={"form-signup-button"}>
                            <ReturnFormButton
                                onClick={() => sendSignInRequest(values)}
                            >Log In</ReturnFormButton>
                        </div>
                        <span
                            style={{color: "rgba(255, 255, 255, 0.7)", paddingBottom: "20px", paddingTop: "10px"}}>Don't have an account ? <a
                            href="/signup"
                            style={{paddingLeft: '2px', fontWeight: "bold", color: "#5BC0BE"}}>Sign up</a></span>
                        <div ref={displayMsgRef} className={"msg-display-signin"}>{displayMsg}</div>
                    </Box>
                </Container>
            </div>
        </div>
    )
}