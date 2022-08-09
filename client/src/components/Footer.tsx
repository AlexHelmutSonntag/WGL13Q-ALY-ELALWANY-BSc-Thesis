import React, {ReactNode} from "react";
import "../style/Footer.scss"
const contactList = [
    {name: "LinkedIn", link: "https://www.linkedin.com/in/alyelalwany/"},
    {name: "ResearchGate", link: "https://www.researchgate.net/profile/Aly-Elalwany"},
    {name: "Github", link: "https://github.com/AlexHelmutSonntag"},
]

const listItems: ReactNode = contactList.map((item) => {
    return <div>
        <li style={{paddingLeft: '12px', 'paddingTop':'2px'}}>
            <a className={"footer-list-item"} href={item.link}>{item.name}</a>
        </li>
    </div>
});
export const Footer: React.FC = () => {
    return (
        <div>
            <ul className={"footer-list"}>Contact
                    {listItems}
            </ul>
        </div>

    )
}