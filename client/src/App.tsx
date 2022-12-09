import React from "react";
import './style/Button.scss'
import './style/App.scss'
import './style/Login-Logout.scss'
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import {BrowserRouter as Router, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {SignInPage} from "./components/SignInPage";
import {PageNotFound} from "./components/PageNotFound";
import {HomePage} from "./components/HomePage";
import {AccountSettingsPage} from "./components/AccountSettingsPage";
import {Gender, Language, ProficiencyLevel, Role, RoomState, UpdateUserState} from "./Types";
import {StartPage} from "./components/StartPage";
import {SignUpPage} from "./components/SignUpPage";
import {useAppDispatch, useAppSelector} from "./store/hooks";
import {
    selectUser
} from "./feature/user/userSlice";
import {selectToken} from "./feature/token/tokenSlice";
// import {Tester} from "./components/Tester";
import {IndexPage} from "./components/IndexPage";
import {RoomPage} from "./components/RoomPage";
import {AdminPage} from "./components/AdminPage";
import {selectRooms} from "./feature/rooms/roomsSlice";


const generateRoomsRoutes = (rooms: RoomState[]) => {
    console.log(JSON.stringify(rooms))
    return (rooms.map(room =>
            <Route path={`/room/${room.roomID}`}
                   element={<RoomPage
                       language={room.language}
                       clients={[]}
                       proficiencyLevel={room.proficiencyLevel}
                       roomID={room.roomID} createdAt={room.createdAt}/>}/>
        )
    )
}

const App: React.FC = () => {
    const token = useAppSelector(selectToken)
    const rooms = useAppSelector(selectRooms)
    const [accessToken, setAccessToken] = React.useState<string>(token ? token : "");
    const [selectedRoom, setSelectedRoom] = React.useState<RoomState>({
        language: Language.GERMAN,
        proficiencyLevel: ProficiencyLevel.NATIVE,
        capacity: 2,
        createdAt: new Date(),
        roomID: "1",
        clients: []
    });

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

    const receiveRoomFromStartPage = (room: RoomState) => {
        console.log(JSON.stringify(room));
        setSelectedRoom(room);
    }

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
    const roomNumber = 1;
    console.log(selectedRoom.roomID)
    return (
        <Router>
            <div className="App">
                <Header/>
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
                    <Route path={"/start"} element={<StartPage passValuesToParent={receiveRoomFromStartPage}/>}/>
                    <Route path={"/admin"} element={<AdminPage/>}/>
                    <Route path={"/"} element={<IndexPage/>}/>
                    {generateRoomsRoutes(rooms)}
                    <Route path={"*"} element={<PageNotFound/>}/>
                </Routes>
                <Footer/>
            </div>
        </Router>
    )
};
export default App;