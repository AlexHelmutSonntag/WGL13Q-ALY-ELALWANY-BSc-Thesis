import React, {useEffect, useRef, useState} from "react";
interface MapProps extends google.maps.MapOptions {
    style?: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
    children: any;
}


export const MapComponent: React.FC<MapProps>= ({
                                           onClick,
                                           onIdle,
                                           children,
                                           style,
                                           ...options
                                       }) =>{
    const ref = useRef<HTMLDivElement>(null);
    const [map,setMap] = useState<google.maps.Map>()
    useEffect(() => {
        if(ref.current && !map){
            setMap(new window.google.maps.Map(ref.current, {}));
        }

    },[ref,map])
    return <div ref={ref}></div>
}