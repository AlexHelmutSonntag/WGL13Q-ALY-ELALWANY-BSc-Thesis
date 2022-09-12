import React, {ReactNode} from "react";
import "../style/Footer.scss"
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SchoolIcon from '@mui/icons-material/School';
const contactList = [
    {name: "LinkedIn", link: "https://www.linkedin.com/in/alyelalwany/", icon : <LinkedInIcon/>},
    {name: "Github", link: "https://github.com/AlexHelmutSonntag",icon:<GitHubIcon/>},
    {name: "ResearchGate", link: "https://www.researchgate.net/profile/Aly-Elalwany",icon:<SchoolIcon/>},
]

const listItems: ReactNode = contactList.map((item) => {
    return <div>
        <li style={{paddingLeft: '12px', 'paddingTop':'2px'}}>
            <a className={"footer-list-item"} href={item.link}>{item.icon}</a>
        </li>
    </div>
});
export const Footer: React.FC = () => {
    return (
        <div>
            <ul className={"footer-list"}>
                    {listItems}
            </ul>
        </div>

    )
}