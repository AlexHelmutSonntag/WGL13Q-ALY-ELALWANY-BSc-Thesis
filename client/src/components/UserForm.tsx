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
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import React from "react";
import {Gender, Role, UpdateUserState, UserState} from "../Types";
import {validateEmail, validatePasswordInput} from "../Utils";


//TODO
// pass flag with 'UserForm' to check if it's sign up or data update.


export const UserForm: React.FC<UpdateUserState> = (userState: UpdateUserState,) => {
    const [values, setValues] = React.useState<UserState>({
        firstName: userState.firstName ? userState.firstName : "",
        lastName: userState.lastName ? userState.lastName : "",
        role: userState.role ? userState.role : Role.USER,
        email: userState.email ? userState.email : "",
        username: userState.username ? userState.username : "",
        password: '',
        repeatedPassword: '',
        showPassword: false,
        passwordsEqual: false,
        validEmail: false,
        date: userState.date,
        gender: userState.gender ? userState.gender : Gender.MALE,
    });

    if (userState.passValuesToParent) {
        userState.passValuesToParent(values);
    }
    const handleChange =
        (prop: keyof UserState) => (event: React.ChangeEvent<HTMLInputElement> | any) => {
            values.passwordsEqual = validatePasswordInput(values.password, values.repeatedPassword);
            values.validEmail = validateEmail(values.email);
            setValues({...values, [prop]: event.target.value});
            handleDateChange(values.date);
        };


    // const [gender, setGender] = React.useState<Gender | string | undefined>(Gender.MALE);
    // const handleGenderChange = (event: SelectChangeEvent) => {
    //     setValues({
    //         ...values
    //     });
    //     setGender(event.target.value as Gender);
    // };

    const [date, setDate] = React.useState<Date | null>(
        userState.date
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

    return (
        <div>
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
                                <MenuItem value={Gender.FEMALE}>Other</MenuItem>
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
        </div>
    )
}