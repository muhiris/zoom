import { BsFillMicMuteFill } from "react-icons/bs";
import Button from "../components/Button";
import { BsMicFill, BsCameraVideoFill, BsCameraVideoOffFill, BsPeopleFill } from 'react-icons/bs';
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import { MdChat } from "react-icons/md";
import { useStream } from '../context/streamContext';

function CallControls({ handleSideBar, handleEndCall, handleToggleScreenShare}) {

    const { isScreenSharing, toggleCamera, toggleMicrophone, toggleSound, camera, sound, microphone} = useStream();


  return (
    <div className='bg-black flex items-center justify-between w-full h-[10%] max-h-[10%] border'>
        <div className='flex items-center gap-4 justify-center flex-1'>
          <div className='flex flex-col items-center'>
            {sound ?
              <GiSpeaker className='text-white text-2xl' onClick={toggleSound} /> :
              <GiSpeakerOff className='text-white text-2xl' onClick={toggleSound} />
            }
            <p className='text-lg text-white'>Speaker</p>
          </div>
          <div className='flex flex-col items-center'>
            {microphone ?
              <BsMicFill className='text-white text-2xl' onClick={toggleMicrophone} /> :
              <BsFillMicMuteFill className='text-white text-2xl' onClick={toggleMicrophone} />
            }
            <p className='text-lg text-white'>Microphone</p>
          </div>
          <div className='flex flex-col items-center'>
            {
              camera ?
                <BsCameraVideoFill className='text-white text-2xl' onClick={toggleCamera} /> :
                <BsCameraVideoOffFill className='text-white text-2xl' onClick={toggleCamera} />
            }
            <p className='text-lg text-white'>Camera</p>
          </div>
        </div>

        <div className='flex flex-1 items-center gap-4 justify-center'>
          <div className='flex flex-col items-center'>
            <BsPeopleFill className='text-white text-2xl' onClick={() => { handleSideBar('Participants') }} />
            <p className='text-lg text-white'>Participants</p>
          </div>
          <div className='flex flex-col items-center'>
            <MdChat className='text-white text-2xl' onClick={() => { handleSideBar('Messages') }} />
            <p className='text-lg text-white'>Messages</p>
          </div>
          <div className='flex flex-col items-center'>
            {
              isScreenSharing ?
                <MdOutlineStopScreenShare className='text-white text-2xl' onClick={handleToggleScreenShare} /> :
                <MdOutlineScreenShare className='text-white text-2xl' onClick={handleToggleScreenShare} />
            }
            <p className='text-lg text-white'>Screen Share</p>
          </div>
        </div>

        <div className='flex flex-1 items-center justify-center gap-4'>
          <Button style={{ backgroundColor: "red" }} text={"End Call"} onClick={handleEndCall} />

        </div>

      </div>
  )
}

export default CallControls