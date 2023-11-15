import React, { useEffect } from 'react'
import { BsFillMicMuteFill, BsMicFill, BsCameraVideoFill, BsCameraVideoOffFill,  BsPeopleFill } from 'react-icons/bs';
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md';
import {GiSpeaker, GiSpeakerOff} from 'react-icons/gi';
import Button from './Button';

function MyStreamView(props) {
    
    useEffect(() => {
        if(props?.src){
            console.log("I AM RUNNING");
            document.getElementById('myVideo').srcObject = props.src;
            document.getElementById('myVideo').style.transform = 'scaleX(-1)';

            if(props.screenShare){
                //rotate Y axis 180deg
                document.getElementById('myVideo').style.transform = 'scaleX(1)';
            }
        }

    }, [props?.src])

    return (
        <div style={props.style} className='relative flex flex-1 w-full h-full items-center justify-center'>
            <video style={props.videoStyle} id='myVideo'  autoPlay className='w-full h-full flex-1 object-contain bg-black' muted="muted" playsInline />
            {!props.hideControls && <div className='flex-1  flex items-center justify-between absolute bottom-0 w-full'>
                <div className='flex items-center gap-4 justify-center flex-1'>
                    <div className='flex flex-col items-center'>
                        {props.speaker ?
                            <GiSpeaker className='text-white text-2xl' onClick={props.toggleSpeaker} />:
                            <GiSpeakerOff className='text-white text-2xl' onClick={props.toggleSpeaker} /> 
                        }
                        <p className='text-lg text-white'>Speaker</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        {props.microphone ?
                            <BsMicFill className='text-white text-2xl' onClick={props.toggleMicrophone} />:
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
                    <Button style={{backgroundColor:"red"}} text={"End Call"} onClick={props.endCall} />
                    
                </div>}

            </div>}
        </div>
    )
}

export default MyStreamView