import React from "react";
import './style/Button.scss'
import './style/App.scss'
import './style/Login-Logout.scss'
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {SignInPage} from "./components/SignInPage";
import {PageNotFound} from "./components/PageNotFound";
import {HomePage} from "./components/HomePage";
import {AccountSettingsPage} from "./components/AccountSettingsPage";
import {Gender, Role, UpdateUserState} from "./Types";
import {StartPage} from "./components/StartPage";
import {SignUpPage} from "./components/SignUpPage";
import {useAppDispatch, useAppSelector} from "./store/hooks";
import {
    selectUser, setAuthenticated, setDOB, setEmail,
    setFirstname, setGender,
    setLastname, setRole,
    setUsername,
    userSlice
} from "./feature/user/userSlice";
import {selectToken, tokenSlice} from "./feature/token/tokenSlice";
import {Tester} from "./components/Tester";


const App: React.FC = () => {

    const token = useAppSelector(selectToken)
    const [accessToken, setAccessToken] = React.useState<string>(token ? token : "");
    const dispatch = useAppDispatch()

    const [userState, setUserState] = React.useState<UpdateUserState>({
        username: "",
        firstName: "",
        lastName: "",
        dob: new Date("1987-09-08"),
        email: "",
        gender: Gender.MALE,
        role: Role.USER,
        password: "",
    })

    const handleLogin = (isLoggedIn: boolean, username: string, user: UpdateUserState) => {
        console.log(`App.tsx logged in : ${isLoggedIn}`)
        if (isLoggedIn) {
            setAccessToken(token !== null ? token : "");
            let config: any;
            if (accessToken !== null) {
                config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            }
            setUserState(
                {
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    role: user.role,
                    email: user.email,
                    dob: user.dob,
                    password: user.password
                }
            )
        } else {
            console.error("ERROR!: NOT LOGGED IN");
        }
    }

    const userFromStore = useAppSelector(selectUser);

    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path={"/signup"} element={<SignUpPage/>}/>
                    <Route path={"/login"}
                           element={<SignInPage isAuthenticated={userFromStore.isAuthenticated}
                                                changeLoginState={handleLogin}/>}/>
                    <Route path={"/home"} element={<HomePage
                        password={""}
                        firstName={userFromStore.firstName} lastName={userFromStore.lastName}
                        username={userFromStore.username} dob={new Date(userFromStore.dob)}
                        email={userFromStore.email} role={userFromStore.role}
                        gender={userFromStore.gender}/>}/>
                    <Route path={"/account"}
                           element={<AccountSettingsPage accessToken={accessToken}
                                                         isAuthenticated={userFromStore.isAuthenticated}
                                                         password={""}
                                                         firstName={userFromStore.firstName}
                                                         lastName={userFromStore.lastName}
                                                         username={userFromStore.username}
                                                         dob={new Date(userFromStore.dob)}
                                                         email={userFromStore.email} role={userFromStore.role}
                                                         gender={userFromStore.gender}
                           />}/>
                    <Route path={"/start"} element={<StartPage isAuthenticated={userFromStore.isAuthenticated}/>}/>
                    <Route path={"/docs"} element={<Tester/>}/>
                    <Route path={"*"} element={<PageNotFound/>}/>
                </Routes>
                <Footer/>
            </div>
        </Router>
    )
};
export default App;