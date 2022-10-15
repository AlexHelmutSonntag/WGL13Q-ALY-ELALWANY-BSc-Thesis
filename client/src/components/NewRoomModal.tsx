import React, {PropsWithChildren} from "react";
import ReactDOM from "react-dom";


interface NewRoomModalProps extends PropsWithChildren{
    onBackDropClick : () => void;
    children?:any;
}
export const NewRoomModal : React.FC<NewRoomModalProps> = ({onBackDropClick,children}) =>{

    return ReactDOM.createPortal(<div onClick={onBackDropClick}>
        {children}
    </div>, document.getElementById("start-page")!)

}