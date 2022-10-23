import React from "react";
import {Navigate} from "react-router-dom";
import {UpdateUserState} from "../Types";
import {useAppSelector} from "../store/hooks";
import {selectUser} from "../feature/user/userSlice";


export const HomePage: React.FC<UpdateUserState> = (props) => {

    const user = useAppSelector(selectUser);
    if (!user.isAuthenticated) {
        return <Navigate to={"/"}/>
    }

    return <div>
        <h1>Welcome home, {user.firstName}!</h1>
    </div>
}