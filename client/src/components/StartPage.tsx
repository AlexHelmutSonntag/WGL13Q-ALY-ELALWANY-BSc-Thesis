import React from "react";
import {Navigate} from "react-router-dom";
import {store} from "../store/store";
import {useAppSelector} from "../store/hooks";
import {selectUser} from "../feature/user/userSlice";

interface state {
    isAuthenticated: boolean;
}

export const StartPage: React.FC<state> = (props) => {

    const user = useAppSelector(selectUser);
    if (!user.isAuthenticated) {
        return <Navigate to={"/login"}/>
    }

    return (<div>
        <h1>
            Start page for {`${user.firstName} ${user.lastName}`}
        </h1>
    </div>)
}