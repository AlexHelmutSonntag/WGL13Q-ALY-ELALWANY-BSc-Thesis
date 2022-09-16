import React from "react";
import {Navigate, Route, useNavigate} from "react-router-dom";


interface ComponentProps {
    component: any;
    path: string;
}

export const ProtectedRoute: React.FC<ComponentProps> = ({component,...props}) => {
    const isAuthenticated: boolean = localStorage.getItem("isAuthenticated") === "true";
    return (
        <div>
            {isAuthenticated ? <Route  path={props.path} element={component}/> : <Navigate to={"/login"}/>}
        </div>
    )
}


