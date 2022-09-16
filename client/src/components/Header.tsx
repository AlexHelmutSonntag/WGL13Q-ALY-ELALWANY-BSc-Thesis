import React, {useState} from "react";
import '../style/Button.scss'
import {LoginButton} from "./LoginButton";
import {SignupButton} from "./SignupButton";
import '../style/Header.scss'
import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import {useNavigate} from "react-router-dom";

interface HeaderProps {
    loggedIn: boolean;
}

const styles = {
    largeIcon: {
        width: 60,
        height: 60,
    },

};
export const Header: React.FC<HeaderProps> = (props) => {
    const navigate = useNavigate();
    const logOutUser: any = () => {
        localStorage.removeItem('refresh-token');
        localStorage.removeItem('access-token');
        localStorage.removeItem('isAuthenticated');
        navigate("/login");
    }

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
                                href="/"
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
                            <Box>
                                <Button href={"/docs"} sx={{
                                    fontSize: 'x-large',
                                    color: '#1C2541',
                                    fontWeight: 300,
                                    textTransform: "none"
                                }}>
                                    Docs
                                </Button>
                            </Box>
                            {localStorage.getItem("isAuthenticated") &&
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
                        </div>
                        <div className={"login-signup-buttons"}>
                            <Box style={{
                                height: "50px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                {localStorage.getItem("isAuthenticated") ?
                                    [
                                        <LoginButton onClick={logOutUser}>Logout</LoginButton>,
                                        <a href={"/account"}>
                                            <PersonIcon style={{
                                                "color": "#1C2541",
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