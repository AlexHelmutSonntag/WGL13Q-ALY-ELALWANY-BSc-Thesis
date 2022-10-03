import React from "react";

export class TestVideo extends React.Component {
    myRef: React.RefObject<HTMLVideoElement>;

    constructor(props: any) {
        super(props);
        this.myRef = React.createRef();
    }

    render() {
        return <video style={{outline: "solid red 1px"}} ref={this.myRef}>Test Video</video>
    }
}