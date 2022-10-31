import React from "react";
import "../style/FormInputMessageContainer.scss"
export const FormInputMessageContainer: React.FC = () => {
    return (<div id={"signup-rules"}>
        <ul>
            Take care
            <li>Both first and last names must start with an uppercase letter</li>
            <li>Your email must be of the format : <i>email@example.com</i></li>
            <li>Your username must be unique.</li>
            <li>Make sure the password is inputted correctly by clicking on the eye next to the field</li>
        </ul>
        <ul>
            Password rules
            <li> At least 8 characters long</li>
            <li> 2 letters in Upper Case</li>
            <li> 1 Special Character (!@#$&*.)</li>
            <li> 2 numerals (0-9)</li>
            <li> 3 letters in Lower Case</li>
        </ul>
    </div>)
}