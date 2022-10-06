import React from "react";
import {Navigate, Route} from "react-router-dom";
import {useAppSelector} from "../store/hooks";
import {selectToken} from "../feature/token/tokenSlice";


interface ComponentProps {
    component: any;
    path: string;
}

export const ProtectedRoute: React.FC<ComponentProps> = ({component, ...props}) => {

    const token = useAppSelector(selectToken)
    const isAuthenticated: boolean = !!token;
    return (
        <div>
            {isAuthenticated ? <Route path={props.path} element={component}/> : <Navigate to={"/login"}/>}
        </div>
    )
}


