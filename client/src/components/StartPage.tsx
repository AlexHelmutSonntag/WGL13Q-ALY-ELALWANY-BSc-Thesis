import React from "react";
import { Navigate } from "react-router-dom";

interface state {
    isAuthenticated: boolean;
}

export const StartPage:React.FC<state>= (props) => {

    if (!props.isAuthenticated){
        return <Navigate to={"/login"}/>
    }

    return (<div>
            <h1>
                Start page
            </h1>
    </div>)
}