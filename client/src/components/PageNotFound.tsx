import React from "react";

export const PageNotFound: React.FC = () => {
    return (
        <div style={{backgroundColor: '#3A506B',  padding: '10px 10px 10px 10px', minHeight: '85vh'}}>
            <h1 style={{color: "white", paddingTop: '10px'}}>
                Ops! 404 Page not found!
            </h1>
            <h2 style={{color: "white", fontStyle : "italic"}}> It might still be under construction.</h2>
        </div>
    )
}