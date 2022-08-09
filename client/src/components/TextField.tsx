import React from "react";


interface Props {
    text: string;
    ok?: boolean;
    num?: number;
    className?: string;
}

export const TextField: React.FC<Props> = (props) => {
    return (
        <div>
            <input title={props.text}/>
        </div>
    )
}