import React from "react";
import {Button} from "@mui/material";
import {CSSProperties} from "react";
import {styled} from "@mui/material/styles";
import {ButtonProps} from "@mui/material/Button";

const styles : any = (theme : any) => ({
    "loginButton":{
        "color": "#FFFFFF",
        "backgroundColor": "#9292d2",
        "width": '20ch',
        "height": '5ch',
    },
    "logoutButton" :{
    "backgroundColor": "#9292d2",
    "width": 60,
    "height": 20,
    }
});
export interface StyleButtonProps{
    backgroundColor?: string;
    color?: string;
    text: string;
    className?: string;
}

const styleNew : CSSProperties ={
    "width": '20ch',
    "height": '5ch',
    "marginTop": 10,
    "marginLeft": 5,
    "marginRight": 5,
    "borderRadius": 10,
    "textTransform": "none",
    "fontWeight": "bold",
}

export const CustomButton: React.FC<StyleButtonProps> = (props) => {


    return (
        <div>
            <Button style={{
                "width": '20ch',
                "height": '5ch',
                "marginTop": 10,
                "marginLeft": 5,
                "marginRight": 5,
                "borderRadius": 10,
                "textTransform": "none",
                "fontWeight": "bold",
                color: props.color,
                backgroundColor: props.backgroundColor,
            }}
                    className={props.className}>{props.text}</Button>
        </div>
    )
}

