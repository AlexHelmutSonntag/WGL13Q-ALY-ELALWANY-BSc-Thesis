import React from "react";
import {CustomTextField} from "./CustomTextField";


export const ParentComponent : React.FC= () =>{

    let receiveNameFromChild = (name: string) =>{
        console.log(name)
    }

    return (<div>
        <CustomTextField name={"ali"} passNameToParent={receiveNameFromChild}>Text</CustomTextField>
    </div>)
}
