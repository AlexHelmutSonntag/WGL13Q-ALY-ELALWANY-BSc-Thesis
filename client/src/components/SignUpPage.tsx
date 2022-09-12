import React from "react";
import {useNavigate} from 'react-router-dom';
import {
    Box,
    Container,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    SelectChangeEvent,
    Stack,
    TextField
} from "@mui/material";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import '../style/SignUpPage.scss';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Gender, UserState} from "../Types";
import {ReturnFormButton} from "./FormButton";
import axios from "axios";
import {validateEmail, validatePasswordInput} from "../Utils";

export const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const [values, setValues] = React.useState<UserState>({
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

    const handleChange =
        (prop: keyof UserState) => (event: React.ChangeEvent<HTMLInputElement> | any) => {
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
                gender: body.gender
            }
            console.log(body);
            axios.post('http://localhost:8080/api/v1/user/new',
                payload,
            ).then((response) => {
                    console.log(response);
                    if (response.status === 201) {
                        alert("User created, try your credentials..");
                        navigate("/login");
                    }
                }
            ).catch((error) => console.log(error));

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
            const response = await axios.get("http://localhost:8080/api/v1/user/1");
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    async function displayUsers() {
        await fetch("http://localhost:8080/api/v1/user/all", {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
        // const users = axios.get("http://localhost:8080/api/v1/user").then(r => console.log(r));
    }

    // displayUsers().then(r => console.log(r));

    return (
        <div style={{backgroundColor: '#3A506B', padding: '10px 10px 10px 10px'}}>
            <div style={{backgroundColor: '#1C2541', paddingLeft: '50px', paddingTop: '10px', borderRadius: '15px'}}>
                <h1 style={{color: "white", paddingTop: '10px'}}>
                    Sign Up
                </h1>
                <div style={{display: `flex`, alignItems:`center` ,flexDirection: `column`, outline: `1px red solid`}}>
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
                                }
                            },

                        }}>
                            <div style={{
                                display: "flex",
                                marginTop: '10px',
                            }}>
                                <TextField required id="firstname-field" value={values.firstName} label="First name"
                                           onChange={handleChange('firstName')}
                                           variant="outlined"/>
                                <TextField required id="lastname-field" value={values.lastName}
                                           onChange={handleChange('lastName')}
                                           label="Last name"
                                           variant="outlined"/>
                            </div>
                            <div style={{
                                display: "flex",
                                marginTop: '10px',
                            }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={3} sx={{}}>
                                        <DesktopDatePicker
                                            label="Birth date"
                                            inputFormat="MM/dd/yyyy"
                                            value={values.date}
                                            onChange={handleDateChange}
                                            minDate={new Date('1940-01-01')}
                                            maxDate={new Date()}
                                            renderInput={(params: any) => <TextField {...params}
                                            />}
                                        />
                                    </Stack>
                                </LocalizationProvider>
                                <div
                                    style={{}}>
                                    <TextField
                                        id="demo-simple-select"
                                        value={values.gender}
                                        label="Gender"
                                        variant={"outlined"}
                                        select
                                        onChange={handleChange('gender')}
                                        sx={{
                                            marginBottom: 1,
                                            width: '25.5ch',
                                            height: '6ch',
                                            backgroundColor: 'rgba(58, 80, 107, 0.7)',
                                        }}
                                    >
                                        <MenuItem value={Gender.MALE}>Male</MenuItem>
                                        <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                                        <MenuItem value={Gender.OTHER}>Other</MenuItem>
                                    </TextField>
                                </div>
                            </div>
                            <div style={{
                                marginTop: '10px',
                                display: "flex"
                            }}>
                                <TextField required id="username-field" value={values.username}
                                           onChange={handleChange('username')}
                                           label="Username"
                                           variant="outlined"/>
                                <TextField required id="outlined-basic" value={values.email}
                                           onChange={handleChange('email')}
                                           label="Email" variant="outlined"/>
                            </div>
                            <div style={{
                                display: "flex",
                                marginTop: '10px',
                            }}>
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
                                        label="Repeat Password"
                                    />
                                </FormControl>
                            </div>
                        </Box>
                    </Container>
                    <div id={"form-signup-button"}>
                        <ReturnFormButton
                            onClick={() => sendSignUpRequest(values)}
                        >Sign Up</ReturnFormButton>
                    </div>
                    <span style={{color: "rgba(255, 255, 255, 0.7)", paddingBottom: "20px", paddingTop: "10px"}}>Already have an account ? <a
                        href="/login"
                        style={{paddingLeft: '2px', fontWeight: "bold", color: "#5BC0BE"}}>Sign in</a></span>
                </div>
            </div>

        </div>
    )
}