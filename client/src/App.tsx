import React from "react";
import './style/Button.scss'
import './style/App.scss'
import './style/Login-Logout.scss'
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import {SignUpPage} from "./components/SignUpPage";
import {
    Routes,
    Route, BrowserRouter as Router
} from "react-router-dom";


const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Header/>
                <Routes>
                    <Route path={"/signup"} element={<SignUpPage/>}/>
                </Routes>
                <Footer/>
            </div>
        </Router>
    )
};
export default App;