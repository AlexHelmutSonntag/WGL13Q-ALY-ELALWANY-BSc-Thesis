import React from "react";
import './style/Button.scss'
import './style/App.scss'
import './style/Login-Logout.scss'
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import {SignUpPage} from "./components/SignUpPage";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {SignInPage} from "./components/SignInPage";
import {PageNotFound} from "./components/PageNotFound";
import {HomePage} from "./components/HomePage";
import {AccountSettingsPage} from "./components/AccountSettingsPage";
import {Gender, Role} from "./Types";


const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Header/>
                <Routes>
                    <Route path={"/signup"} element={<SignUpPage/>}/>
                    <Route path={"/login"} element={<SignInPage/>}/>
                    <Route path={"/home"} element={<HomePage/>}/>
                    <Route path={"/account"}
                           element={<AccountSettingsPage password={""} firstName={"Helmut"} lastName={"Alex"}
                                                         username={"mariam21"} date={new Date("1987-09-08")}
                                                         email={"helmut@email.com"} role={Role.USER}
                                                         gender={Gender.MALE}
                           />}/>
                    <Route path={"*"} element={<PageNotFound/>}/>
                </Routes>
                <Footer/>
            </div>
        </Router>
    )
};
export default App;