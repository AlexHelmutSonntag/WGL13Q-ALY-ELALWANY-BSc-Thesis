import React from "react";
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

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
import {LoginState} from "../Types";
import axios from "axios";


export const SignInPage: React.FC = () => {
    const navigate = useNavigate();
    const [values, setValues] = React.useState<LoginState>({
        email: '',
        username: '',
        password: '',
        validEmail: false,
        showPassword: false,
    });

    const validateEmail = (email: string) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    const handleChange =
        (prop: keyof Partial<LoginState>) => (event: React.ChangeEvent<HTMLInputElement> | any) => {
            values.validEmail = validateEmail(values.email);
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


    const sendSignInRequest : any = async (body: any) => {
        if (body.password !== "") {
            let params: any = {
                username: body.username, password: body.password
            }
            console.log(params);
            await axios({
                method: 'post',
                url: 'http://localhost:8080/login',
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                data: qs.stringify(params),
            }).then(response => {
                console.log(response);
                if (response.data.access_token && response.data.refresh_token) {
                    navigate("/home");
                }
            }).catch(err => console.log(err));

            // axios.post('http://localhost:8080/login', params, {
            //         params: {
            //             username: body.username,
            //             password: body.password,
            //         }
            //     }
            // ).then((response) => {
            //
            //     console.log(response)
            //
            //     if (response.status === 200) {
            //
            //     } else {
            //         console.log("Something went wrong with the login, try again!");
            //     }
            //
            // }).catch((error) => console.log(error));

        }
    }
    return (
        <div style={{backgroundColor: '#3A506B', padding: '10px 10px 10px 10px', minHeight: '80vh'}}>
            <div
                style={{
                    backgroundColor: '#1C2541',
                    paddingLeft: '50px',
                    paddingTop: '10px',
                    borderRadius: '15px',
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
                            borderRadius: '10px',
                            marginTop: 1,
                            marginBottom: 1,
                            borderColor: 'rgba(58, 80, 107, 0.7)',
                            color: '#4A5B70',
                            '&:hover': {
                                borderColor: 'transparent',
                                outline: '1px solid rgba(58, 80, 107, 0.7)',
                            }
                        },
                    }}>

                        <TextField required id="username-field" value={values.username}
                                   onChange={handleChange('username')} label="Username"
                                   variant="outlined"/>
                        <FormControl
                            sx={{
                                m: 1,
                                width: '25ch',
                                backgroundColor: 'rgba(58, 80, 107, 0.7)',
                                borderRadius: '10px',
                            }}
                            variant="outlined">
                            <InputLabel required htmlFor="password-input">Password</InputLabel>
                            <OutlinedInput
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
                    </Box>
                </Container>
            </div>
        </div>
    )
}