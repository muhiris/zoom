import React, { forwardRef, useEffect, useRef } from 'react'
import { BsFillMicMuteFill, BsMicFill, BsCameraVideoFill, BsCameraVideoOffFill, BsPeopleFill } from 'react-icons/bs';
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import Button from './Button';

// eslint-disable-next-line react/display-name
const MyStreamView = (props) => {

    const videoRef = useRef(null);

    useEffect(() => {
        if (props?.src) {
            videoRef.current.srcObject = props.src;
            videoRef.current.style.transform = 'scaleX(-1)';

            if (props.screenShare) {
                //rotate Y axis 180deg
                videoRef.current.style.transform = 'scaleX(1)';
            }
        }

    
        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };

    }, [props.src]);


    return (
        <div style={props.style} className='relative flex flex-1 w-full h-full items-center justify-center'>
            <video ref={videoRef} style={props.videoStyle} id='myVideo' autoPlay className='w-full h-full min-w-full min-full max-w-full max-h-full flex-1 object-contain' muted={true} playsInline />
            {!props.hideControls && <div className='flex-1  flex items-center justify-between absolute bottom-0 w-full'>
                <div className='flex items-center gap-4 justify-center flex-1'>
                    <div className='flex flex-col items-center'>
                        {props.speaker ?
                            <GiSpeaker className='text-white text-2xl' onClick={props.toggleSpeaker} /> :
                            <GiSpeakerOff className='text-white text-2xl' onClick={props.toggleSpeaker} />
                        }
                        <p className='text-lg text-white'>Speaker</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        {props.microphone ?
                            <BsMicFill className='text-white text-2xl' onClick={props.toggleMicrophone} /> :
                            <BsFillMicMuteFill className='text-white text-2xl' onClick={props.toggleMicrophone} />
                        }
                        <p className='text-lg text-white'>Microphone</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        {
                            props.camera ?
                                <BsCameraVideoFill className='text-white text-2xl' onClick={props.toggleCamera} /> :
                                <BsCameraVideoOffFill className='text-white text-2xl' onClick={props.toggleCamera} />
                        }
                        <p className='text-lg text-white'>Camera</p>
                    </div>
                </div>

                {!props.joinCallScreen && <div className='flex flex-1 items-center gap-4 justify-center'>
                    <div className='flex flex-col items-center'>
                        <BsPeopleFill className='text-white text-2xl' onClick={props.toggleParticipants} />
                        <p className='text-lg text-white'>Participants</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        {
                            props.screenShare ?
                                <MdOutlineStopScreenShare className='text-white text-2xl' onClick={props.toggleScreenShare} /> :
                                <MdOutlineScreenShare className='text-white text-2xl' onClick={props.toggleScreenShare} />
                        }
                        <p className='text-lg text-white'>Screen Share</p>
                    </div>
                </div>}
                {!props.joinCallScreen &&
                    <div className='flex flex-1 items-center justify-center gap-4'>
                        <Button style={{ backgroundColor: "red" }} text={"End Call"} onClick={props.endCall} />

                    </div>}

            </div>}
        </div>
    )
};

export default MyStreamView