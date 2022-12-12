import React from "react";
import '../style/Button.scss'
import {LoginButton} from "./LoginButton";
import {SignupButton} from "./SignupButton";
import '../style/Header.scss'
import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {removeUser, selectUser, setAuthenticated} from "../feature/user/userSlice";
import {removeToken} from "../feature/token/tokenSlice";
import {Role} from "../Types";


export const Header: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const logOutUser: any = () => {
        dispatch({type:"USER_LOGOUT"});
        dispatch(removeToken(""))
        dispatch(setAuthenticated(false))
        dispatch(removeUser(""))

        navigate("/");
    }

    const conditionalRef = user.isAuthenticated? "/" : "/";
    return (
        <div className={"header"}>
            <AppBar position="static" style={{
                backgroundColor: 'transparent',
            }}
                    sx={{'height': 60}}>
                <Toolbar>
                    <div style={{'display': 'flex', justifyContent: 'space-between', 'width': '100%',}}>
                        <div style={{'display': 'flex', 'width': '100%', 'height': '100%'}}>
                            <Typography
                                variant="h4"
                                noWrap
                                component="a"
                                href= {conditionalRef}
                                sx={{
                                    mr: 2,
                                    fontFamily: 'open Sans',
                                    fontWeight: 700,
                                    color: '#1C2541',
                                    textDecoration: 'none',
                                }}
                            >
                                LanX
                            </Typography>
                            <MenuIcon/>
                            <Box>
                                <Button href={"https://github.com/AlexHelmutSonntag/WGL13Q-ALY-ELALWANY-BSc-Thesis"}
                                        sx={{
                                            fontSize: 'x-large',
                                            color: '#1C2541',
                                            fontWeight: 300,
                                            textTransform: "none"
                                        }}>
                                    Github
                                </Button>
                            </Box>
                            {user.isAuthenticated &&
                                <Box>
                                    <Button href={"/start"} sx={{
                                        fontSize: 'x-large',
                                        color: '#1C2541',
                                        fontWeight: 300,
                                        textTransform: "none"
                                    }}>
                                        Start
                                    </Button>
                                </Box>
                            }
                            {user.role=== "ADMIN" &&
                                <Box>
                                    <Button href={"/admin"} sx={{
                                        fontSize: 'x-large',
                                        color: '#e80d25',
                                        fontWeight: 200,
                                        textTransform: "none"
                                    }}>
                                        Admin Panel
                                    </Button>
                                </Box>
                            }
                        </div>
                        <div className={"login-signup-buttons"}>
                            <Box style={{
                                height: "50px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                {user.isAuthenticated ?
                                    [
                                        <LoginButton onClick={logOutUser}>Logout</LoginButton>,
                                        <a href={"/account"}>
                                            <PersonIcon style={{
                                                "color": user.role === Role.USER ? "#1C2541" : "#e80d25",
                                                "fontSize": "200%",
                                                "marginLeft": "20px",
                                                "marginRight": "10px",
                                            }}/>
                                        </a>
                                    ]
                                    : [
                                        <LoginButton href={"/login"}>Login</LoginButton>,
                                        <SignupButton href={"/signup"}>Signup</SignupButton>
                                    ]
                                }
                            </Box>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}