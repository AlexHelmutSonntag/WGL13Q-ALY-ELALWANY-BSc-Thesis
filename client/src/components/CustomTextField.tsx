import React, {PropsWithChildren} from "react";
import {TextField} from "@mui/material";


interface UserProps extends PropsWithChildren{
    name : string;
    passNameToParent?: (value: string) => void;
}

export const CustomTextField: React.FC<UserProps> = ({ name, passNameToParent}) =>{

    const [firstName, setFirstName] = React.useState<string>(name);

    let handleChange = (event: React.ChangeEvent<HTMLInputElement> | any) =>{
        setFirstName(event.target.value);
    }

    if (passNameToParent) {
        passNameToParent(firstName);
    }

    return (
        <div>
            <TextField value={firstName} onChange={handleChange}/>
        </div>
    )
}