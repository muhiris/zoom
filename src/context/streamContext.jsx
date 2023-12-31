// StreamContext.js
import React, { createContext, useContext, useRef, useState } from 'react';
import { setMediaConstraints } from './streamUtilFunctions';

const StreamContext = createContext();

export const useStream = () => useContext(StreamContext);

export const StreamProvider = ({ children }) => {

    //handles the local media stream
    const localMediaStreamRef = useRef(null);
    //handle the display screen stream
    const displayMediaStreamRef = useRef(null);
    //handle the currently displaying stream
    const [stream, setStream] = useState(null);


    //controls the local media stream like camera, microphone, sound
    const [camera, setCamera] = useState(true);
    const [microphone, setMicrophone] = useState(true);
    const [sound, setSound] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // for host controls
    const mutedByHost = useRef(false);
    const videoPausedByHost = useRef(false);



    //initializing the local media stream
    const startLocalMediaStream = async (video = true, audio = true) => {
        if (localMediaStreamRef.current) {
            destroyingMediaStream();
        }

        let mediaConstraints = await setMediaConstraints({
            video: true,
            audio: true,
        });
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);

            if (!video) {
                mediaStream.getVideoTracks()[0].enabled = false;
                setCamera(false);
            }

            if (!audio) {
                mediaStream.getAudioTracks()[0].enabled = false;
                setMicrophone(false);
            }

            localMediaStreamRef.current = mediaStream;
            setStream(mediaStream);
        } catch (err) {
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                if (mediaConstraints.video) {
                    mediaConstraints.video = false;
                    try {
                        const mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
                        if (!audio) {
                            mediaStream.getAudioTracks()[0].enabled = false;
                            setMicrophone(false);
                        }
                        localMediaStreamRef.current = mediaStream;
                        setStream(mediaStream);
                    } catch (err2) {
                        alert("You have denied the permission to access the camera and microphone. Please allow the permission to audio at least to join the meet.");
                    }
                }
            } else {
                alert("Error accessing the camera and microphone. Please check your camera and microphone and try again.");
            }
        }
    };


    //destroying the local media stream
    const destroyingMediaStream = () => {

        localMediaStreamRef.current?.getTracks()?.forEach((track) => {
            track?.stop();
        });

        if (stream) {
            setStream(null);
        }
    }


    // stop screen sharing
    const stopScreenSharing = () => {

        try {
            //removing audio track from the display media stream
            displayMediaStreamRef.current.removeTrack(displayMediaStreamRef.current.getAudioTracks()[0]);

            //stopping the display media stream
            displayMediaStreamRef.current?.getTracks()?.forEach((track) => {
                //* if the track is audio track then dont stop it (as we are using the same audio track for local media stream)
                if (track.kind !== 'audio') {
                    track?.stop();
                }
            });
            displayMediaStreamRef.current = null;

            setIsScreenSharing(false);
            // setCamera(true);
        } catch (err) {
            console.log(err);
        }
    }

    //handle toogle Screen Sharing
    const toggleScreenSharing = async () => {
        try {

            if (videoPausedByHost.current) return;

            if (!isScreenSharing) {

                displayMediaStreamRef.current = await navigator.mediaDevices.getDisplayMedia();
                setCamera(false);
                setIsScreenSharing(true);

                //merge the audio track of the local media stream with the display media stream
                const audioTracks = localMediaStreamRef.current.getAudioTracks();
                if (audioTracks.length > 0) {
                    displayMediaStreamRef.current.addTrack(audioTracks[0]);
                }

                setStream(displayMediaStreamRef.current);

                //* adding a listner to catch stop screen sharing event
                displayMediaStreamRef.current.getVideoTracks()[0].addEventListener('ended', () => {
                    stopScreenSharing();
                    setStream(localMediaStreamRef.current);

                });

            } else {

                stopScreenSharing();
                setStream(localMediaStreamRef.current);

            }

            return true;

        } catch (err) {
            console.log(err);
        }
    }



    // Toggle Microphone
    const toggleMicrophone = async () => {

        try {

            if (mutedByHost.current) return;

            const audioTrack = localMediaStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
            }
            setMicrophone(!microphone);

        } catch (err) {
            console.log(err);
        }
    }

    // Toggle Camera
    const toggleCamera = async () => {
        try {

            if (videoPausedByHost.current) return;

            const videoTracks = await localMediaStreamRef.current.getVideoTracks();
            if (videoTracks.length > 0) {
                const videoTrack = videoTracks[0];
                videoTrack.enabled = !videoTrack.enabled;
            }
            setCamera(!camera);
        } catch (err) {
            console.log(err);
        }
    }

    // Toggle Sound
    const toggleSound = async () => {
        try {

            //* will use this value and will pass it to remote peers video element to mute or unmute the video
            setSound(!sound);

        } catch (err) {
            console.log(err);
        }
    }


    const toggleMuteByHost = (mute) => {
        mutedByHost.current = mute;
        if (mute === true) {
            localMediaStreamRef.current.getAudioTracks()[0].enabled = false;
            setMicrophone(false);
        }
    }

    const toggleVideoPauseByHost = (pause) => {
        videoPausedByHost.current = pause;
        if (pause === true) {
            localMediaStreamRef.current.getVideoTracks()[0].enabled = false;
            setCamera(false);
        }
    }


    return (
        <StreamContext.Provider value={{ stream, camera, sound, microphone, isScreenSharing, startLocalMediaStream, destroyingMediaStream, toggleScreenSharing, toggleCamera, toggleMicrophone, toggleSound, toggleMuteByHost, toggleVideoPauseByHost }}>
            {children}
        </StreamContext.Provider>
    );
};
