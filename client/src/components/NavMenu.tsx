import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import '../style/NavMenu.scss'

const navMenuItems = [
    {name: "Github", link: "https://github.com/AlexHelmutSonntag"},
    {name: "Docs", link: "https://github.com/AlexHelmutSonntag"},
]

const navMenuTabs = navMenuItems.map((item) =>(
    <h4>
        <Link  className={"menu-item"} to={item.link}> {item.name}</Link>
    </h4>
));

export const NavMenu: React.FC = () => {
    return (
        <div className={"nav-menu"}>
            <Router>
                <div className={"logo"}>LanX</div>
            <div className={"nav-menu-tabs"}>{navMenuTabs}</div>
            </Router>
        </div>
    )
}