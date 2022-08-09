import React from "react";
import {Button} from "@mui/material";

interface ButtonProps {
    className: string;
    text: string;
}

const styles : any = (theme : any) => ({
    "loginButton":{
    "background-color": "#9292d2",
    "width": 60,
    "height": 20,
    },
    "logoutButton" :{
    "background-color": "#9292d2",
    "width": 60,
    "height": 20,
    }
});


export const MyButton: React.FC<ButtonProps> = (props) => {
    return (
        <div>
            <Button className={props.className}>{props.text}</Button>
        </div>
    )
}

