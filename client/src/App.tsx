import React, {useState} from "react";
import './style/Button.scss'
import './style/App.scss'
import './style/Login-Logout.scss'
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import {SignUpPage} from "./components/SignUpPage";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import {SignInPage} from "./components/SignInPage";
import {PageNotFound} from "./components/PageNotFound";
import {HomePage} from "./components/HomePage";
import {AccountSettingsPage} from "./components/AccountSettingsPage";
import {Gender, Role} from "./Types";
import {ProtectedRoute} from "./components/ProtectedRoute";
import {StartPage} from "./components/StartPage";

const state = {
    isLoggedIn: false,
}

const App: React.FC = () => {
    const handleLogin = (isLoggedIn :boolean) => {
        state.isLoggedIn = isLoggedIn;
    }

    const isAuthenticated: boolean = localStorage.getItem("isAuthenticated") === "true";

    return (
        <Router>
            <div className="App">
                <Header loggedIn={state.isLoggedIn}  />
                <Routes>
                    <Route path={"/signup"} element={<SignUpPage/>}/>
                    <Route path={"/login"} element={<SignInPage changeLoginState={handleLogin}/>}/>
                    <Route path={"/home"} element={<HomePage/>}/>
                    <Route path={"/account"}
                           element={<AccountSettingsPage isAuthenticated={isAuthenticated} password={""} firstName={"Mariam"} lastName={"Smith"}
                                                         username={"mariam21"} date={new Date("1987-09-08")}
                                                         email={"Mariam@email.com"} role={Role.USER}
                                                         gender={Gender.MALE}
                           />}/>
                    <Route path={"/start"} element={<StartPage isAuthenticated={isAuthenticated}/>}/>
                    <Route path={"*"} element={<PageNotFound/>}/>
                </Routes>
                <Footer/>
            </div>
        </Router>
    )
};
export default App;