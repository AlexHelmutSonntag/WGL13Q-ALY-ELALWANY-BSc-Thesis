import React from "react";
import Button, {ButtonProps} from "@mui/material/Button";
import {styled } from "@mui/material/styles";


interface StyledButtonProps extends ButtonProps{
    success?: boolean;
}

export const ControlButton = styled(Button,{shouldForwardProp: (prop) => prop !=='success',})<StyledButtonProps>(({success,theme}) => ({
    ...(success && {
        width: 100,
        height: 20,
        outline : "1px solid #3A506B",
        background: "#3A506B",
        '& .MuiButtonBase-root':{

        }
    }),
}));
