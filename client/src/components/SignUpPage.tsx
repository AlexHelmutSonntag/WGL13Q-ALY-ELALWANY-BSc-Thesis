import React from "react";
import {
    Box,
    Container,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Stack,
    TextField
} from "@mui/material";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import '../style/SignUpPage.scss';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Gender} from "../Types";
import {FormSignupButton} from "./FormSignUpButton";
import axios from "axios";

interface State {
    firstName: string;
    lastName: string;
    date: Date | null;
    gender: Gender;
    username: string;
    email: string;
    password: string;
    repeatedPassword: string;
    showPassword: boolean;
    passwordsEqual: boolean;
    validEmail: boolean;
}

export const SignUpPage: React.FC = () => {
    const [values, setValues] = React.useState<State>({
        firstName: '',
        lastName: '',
        date: new Date('1999-01-01'),
        gender: Gender.MALE,
        username: '',
        email: '',
        password: '',
        repeatedPassword: '',
        showPassword: false,
        passwordsEqual: false,
        validEmail: false,
    });

    const validateEmail = (email: string) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
        // return String(email)
        //     .toLowerCase()
        //     .match(
        //         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        //     );
    };
    const validatePasswordInput = (password: string, repeatedPassword: string): boolean => {
        if (password === "" || repeatedPassword === "") {
            return false;
        }
        return password.trim() === repeatedPassword.trim();
    }
    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement> | any) => {
            values.passwordsEqual = validatePasswordInput(values.password, values.repeatedPassword);
            values.validEmail = validateEmail(values.email);
            setValues({...values, [prop]: event.target.value});
            handleDateChange(values.date);
        };

    // const handleGenderChangeNew = (event: SelectChangeEvent) => {
    //     setValues(
    //         {
    //             ...values,
    //             gender: Gender[event.target.value as keyof typeof Gender]
    //         }
    //     )
    // }

    const [gender, setGender] = React.useState<Gender | string | undefined>(Gender.MALE);
    const handleGenderChange = (event: SelectChangeEvent) => {
        setValues({
            ...values
        });
        setGender(event.target.value as Gender);
    };

    const [initialDate, setDate] = React.useState<Date | null>(
        new Date('2004-12-31'),
    );
    const handleDateChange = (newValue: Date | null) => {
        values.date = newValue;
        setDate(newValue);
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

    const sendSignUpRequest = (body: any) => {
        console.log(body.date);
        let dd_mm_yyyy = body.date.toLocaleDateString();
        let dob = dd_mm_yyyy.replace(/(\d+)\/(\d+)\/(\d+)/g, "$3-$2-$1");
        if (validateEmail(body.email) && validatePasswordInput(body.password, body.repeatedPassword)) {
            let payload = {
                firstName: body.firstName,
                lastName: body.lastName,
                password: body.password,
                email: body.email,
                dob: dob,
                username: body.username,
            }
            console.log(body);
            axios.post('http://localhost:8080/api/v1/user/new',
                payload,
            ).then((response) => console.log(response)).catch((error) => console.log(error));

            // axios({
            //     method: 'post',
            //     url: 'http://localhost:8080/api/v1/user/new',
            //     data: body
            // }).then((response) => {
            //     console.log(response);
            // }).catch((error) => {
            //     console.log(error());
            // });
        }

    }

    async function getUserData() {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/user");
            console.log(response);
        } catch (error) {
            console.log(error);
            console.log(error);
        }
    }

    async function displayUsers() {
        await fetch("http://localhost:8080/api/v1/user", {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
        // const users = axios.get("http://localhost:8080/api/v1/user");
        // console.log(users);
    }


    // displayUsers().then(r => console.log(r));

    return (
        <div style={{backgroundColor: '#3A506B', padding: '20px'}}>
            <div style={{backgroundColor: '#1C2541', paddingLeft: '50px', paddingTop: '10px', borderRadius: '15px'}}>
                <h1 style={{color: "white", paddingTop: '10px'}}>
                    Sign Up
                </h1>
                <Container sx={{
                    '& .MuiBox-root': {
                        display: 'flex',
                        flexDirection: 'column',
                        outline: '1px solid yellow',
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
                                // outline:'1px solid rgba(58, 80, 107, 0.7)',
                            }
                        },
                        // '& .MuiInputBase-input': {
                        //     // outline:'1px solid red',
                        //     borderColor: 'rgba(58, 80, 107, 0.7)',
                        //     backgroundColor: 'rgba(58, 80, 107, 0.7)',
                        //     borderRadius: '8px',
                        //     '&:hover' :{
                        //         borderColor: 'transparent',
                        //         // outline:'1px solid red',
                        //         // borderColor: 'rgba(58, 80, 107, 0.7)',
                        //
                        //     }
                        // }
                    }}>
                        <TextField required id="firstname-field" value={values.firstName} label="First name"
                                   onChange={handleChange('firstName')}
                                   variant="outlined"/>
                        <TextField required id="lastname-field" value={values.lastName}
                                   onChange={handleChange('lastName')} label="Last name"
                                   variant="outlined"/>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={3}>
                                <DesktopDatePicker
                                    label="Birth date"
                                    inputFormat="MM/dd/yyyy"
                                    value={values.date}
                                    onChange={handleDateChange}
                                    minDate={new Date('1990-01-01')}
                                    maxDate={new Date()}
                                    renderInput={(params: any) => <TextField {...params} />}
                                />
                            </Stack>
                        </LocalizationProvider>
                        <InputLabel id="gender-label" sx={{
                            marginLeft: '10px', color: '#4A5B70',
                        }}>Gender</InputLabel>
                        <Select
                            labelId="gender-label"
                            id="demo-simple-select"
                            value={values.gender}
                            label="Gender"
                            onChange={handleChange('gender')}
                            sx={{
                                marginBottom: 1,
                                width: '25.5ch',
                                backgroundColor: 'rgba(58, 80, 107, 0.7)',
                            }}
                        >
                            <MenuItem value={'Male'}>Male</MenuItem>
                            <MenuItem value={'Female'}>Female</MenuItem>
                            <MenuItem value={'Other'}>Other</MenuItem>
                        </Select>
                        <TextField required id="username-field" value={values.username}
                                   onChange={handleChange('username')} label="Username"
                                   variant="outlined"/>
                        <TextField required id="outlined-basic" value={values.email} onChange={handleChange('email')}
                                   label="Email" variant="outlined"/>
                        <FormControl
                            sx={{m: 1, width: '25ch', backgroundColor: 'rgba(58, 80, 107, 0.7)', borderRadius: '10px',}}
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
                        <FormControl
                            sx={{m: 1, width: '25ch', backgroundColor: 'rgba(58, 80, 107, 0.7)', borderRadius: '10px'}}
                            variant="outlined">
                            <InputLabel required htmlFor="repeat-password-input">Repeat Password</InputLabel>
                            <OutlinedInput
                                id="repeat-password-input"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.repeatedPassword}
                                onChange={handleChange('repeatedPassword')}
                                // endAdornment={
                                //     <InputAdornment position="end">
                                //         <IconButton
                                //             aria-label="toggle password visibility"
                                //             onClick={handleClickShowPassword}
                                //             onMouseDown={handleMouseDownPassword}
                                //             edge="end"
                                //         >
                                //             {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                //         </IconButton>
                                //     </InputAdornment>
                                // }
                                label="Repeat Password"
                            />
                        </FormControl>
                        <div id={"form-signup-button"}>
                            <FormSignupButton
                                onClick={() => sendSignUpRequest(values)}
                            >Sign Up</FormSignupButton>
                        </div>
                        <span style={{color: "rgba(255, 255, 255, 0.7)", paddingBottom: "20px", paddingTop: "10px"}}>Already have an account ? <a
                            href="/login" style={{paddingLeft: '2px', fontWeight: "bold", color: "#5BC0BE"}}>Sign in</a></span>
                    </Box>
                </Container>
            </div>
        </div>
    )
}