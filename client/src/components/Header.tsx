import React from "react";
import '../style/Button.scss'
import {LoginButton} from "./LoginButton";
import {SignupButton} from "./SignupButton";
import '../style/Header.scss'
import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";

export const Header: React.FC = () => {
    return (
        <div className={"header"}>
            <AppBar  position="static" style={{
                backgroundColor: 'transparent',
            }}
            sx={{'height': 60}}>
                <Toolbar>
                    <div style={{'display': 'flex', justifyContent :'space-between','width': '100%',}}>
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
                        </div>
                        <div className={"login-signup-buttons"}>
                            <Box>
                                <LoginButton href={"/login"}>Login</LoginButton>
                                <SignupButton href={"/signup"}>Signup</SignupButton>
                            </Box>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}