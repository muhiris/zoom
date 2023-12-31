// StreamContext.js
import React, { createContext, useContext, useState } from 'react';

const StreamContext = createContext();

export const useStream = () => useContext(StreamContext);

export const PeerProvider = ({ children }) => {

    const [localMediaStream, setLocalMediaStream] = useState(null);

    //controls the local media stream like camera, microphone, sound
    const [camera, setCamera] = useState(true);
    const [microphone, setMicrophone] = useState(true);
    const [sound, setSound] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);





    return (
        <StreamContext.Provider value={{ localMediaStream }}>
            {children}
        </StreamContext.Provider>
    );
};
