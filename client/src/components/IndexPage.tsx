import React from "react";
import {useAppSelector} from "../store/hooks";
import {selectUser} from "../feature/user/userSlice";
import {Navigate} from "react-router-dom";
import "../style/IndexPage.scss"
import flagNL from "../assets/images/flags/nl-flag.png";
import flagDE from "../assets/images/flags/de-flag.png";
import flagArab from "../assets/images/flags/arab-flag.png";
import flagTR from "../assets/images/flags/tr-flag.png";
import flagBE from "../assets/images/flags/be-flag.png";
import flagUK from "../assets/images/flags/uk-flag.png";
import flagES from "../assets/images/flags/es-flag.png";
import flagIT from "../assets/images/flags/it-flag.png";
import flagFR from "../assets/images/flags/fr-flag.png";
import flagHU from "../assets/images/flags/hu-flag.png";
import flagSW from "../assets/images/flags/sw-flag.png";
import flagDK from "../assets/images/flags/dk-flag.png";
import flagIS from "../assets/images/flags/is-flag.png";
import flagFL from "../assets/images/flags/fl-flag.png";
import flagNO from "../assets/images/flags/no-flag.png";
import flagCH from "../assets/images/flags/ch-flag.png";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import {MapComponent} from "./MapComponent";

const mapAPIKey= "AIzaSyDfsM7jIiuj92Sy_CNLfY-QSiTPHkpZxRI"
export const IndexPage: React.FC = () => {

    const user = useAppSelector(selectUser);
    if (user.isAuthenticated) {
        return <Navigate to={"/home"}/>
    }

    return <div id={"index-container"}>
        <div id={"index-header"}>
            <h1>Learn languages with LanX; the first conversation-oriented platform for learning languages.</h1>
            <h2>Here, you can learn all these languages and many more!</h2>
        </div>

        <div id={"flags-section"}>
            <div id={"flags-container"}>
                <img src={flagUK}/>
                <img src={flagDE}/>
                <img src={flagArab}/>
                <img src={flagHU}/>
                <img src={flagIT}/>
                <img src={flagFR}/>
                <img src={flagES}/>
                <img src={flagTR}/>
                <img src={flagNL}/>
                <img src={flagBE}/>
                <img src={flagSW}/>
                <img src={flagNO}/>
                <img src={flagDK}/>
                <img src={flagIS}/>
                <img src={flagFL}/>
                <img src={flagCH}/>
            </div>
        </div>
        <div id={"signup-section"}>
            <h2>Just signup and start using the app to improve your language skills!</h2>
        </div>
        <div id={"example-section"}>
            <h3>Here you should show a snippet of a real chat room</h3>
        </div>
        <div id={"author-section"}>
            <h2>This platform was developed by Aly Elalwany; a fellow polyglot and language learner. For more information, find links to contact in the footer.</h2>
        </div>
    </div>
}