import React, { useEffect, useState } from 'react'
import MyStreamView from '../components/MyStreamView';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { joinMeet } from '../redux/slice/meet/meetAction';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const JoinCall = () => {

    const [localMediaStream, setLocalMediaStream] = useState(null);
    const [camera, setCamera] = useState(true);
    const [microphone, setMicrophone] = useState(true);
    const isVoiceOnly = !camera;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading: meetLoading, meet, error: meetError } = useSelector(state => state.meet);
    const [mediaSource, setMediaSource] = useState('camera');



    let mediaConstraints = {
        audio: { 'echoCancellation': true, deviceId: 'default' },
        video: {
            frameRate: 30,
            facingMode: true,
            mediaSource: mediaSource,
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 }
        }
    };
    // START THE LOCAL MEDIA STREAM
    const startLocalMediaStram = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
            if (isVoiceOnly) {
                let videoTrack = mediaStream.getVideoTracks()[0];
                videoTrack.enabled = false;
                setCamera(false);
            }
            else {
                setCamera(true);
            }
            setLocalMediaStream(mediaStream);
        } catch (err) {
            console.log(err);
        }
    }

    //DESTROY THE LOCAL MEDIA STREAM
    const destroyingMediaStream = () => {
        localMediaStream?.getTracks()?.forEach(
            track => track.stop()
        );
    
        setLocalMediaStream(null);
    }

    const toggleCamera = async () => {
        try {
            const videoTracks = await localMediaStream.getVideoTracks();
            if (videoTracks.length > 0) {
                const videoTrack = videoTracks[0];
                videoTrack.enabled = !videoTrack.enabled;
            }
            setCamera(!camera);
        } catch (err) {
            console.log(err);
        }
    }

    const toggleActiveMicrophone = async () => {

        try {
            const audioTrack = localMediaStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
            }
            setMicrophone(!microphone);
        } catch (err) {
            console.log(err);
        }
    }


    const handleJoinMeeting = (e) => {
        e.preventDefault();

        const payload = {
            meetId: e.target.meetingId.value,
            passcode: e.target.passCode.value || null,
            type: 'internal',
        }

        //* Type is set Internal here because we are joining a meeting by id so doesnot matter if it was a scheduled one or not
        dispatch(joinMeet(payload)).then((res) => {
            if (joinMeet.fulfilled.match(res)) {
                if (res.payload.data.access) {
                    navigate('/call', { state: { video: camera, audio: microphone, meetId: payload.meetId, name: e.target.name.value } });
                } else {
                    toast.error('You are not allowed to join this meeting');
                }
            }
        })
    }


    useEffect(() => {
        startLocalMediaStram();
        window.addEventListener('beforeunload', () => {
            // This function will run when the page is being unloaded (e.g., when reloading or navigating away).
            destroyingMediaStream();
          });

        // document.addEventListener('popstate', handlePopState);
        return () => {
            destroyingMediaStream();
            window.removeEventListener('beforeunload', () => {
                // Remove the beforeunload event listener when the component is unmounted.
            });
            
        }
    }, [])


    return (
        <div className='flex flex-1 flex-col md:flex-row  gap-10 p-20'>
            <div>
                <MyStreamView style={{flex:1}} joinCallScreen={true} src={localMediaStream} microphone={microphone} toggleMicrophone={toggleActiveMicrophone} toggleCamera={toggleCamera} camera={camera} />
            </div>
            <div className='flex flex-col py-5'>
                <p className='text-3xl font-medium text-center'>Join Meeting</p>
                <form className='flex flex-col gap-5 flex-1 justify-center' onSubmit={handleJoinMeeting}>
                    <div className='flex flex-col'>
                        <p>Enter Meeting ID</p>
                        <InputField
                            type='text'
                            placeholder='Enter Meeting ID'
                            name={"meetingId"}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <p>Enter Name</p>
                        <InputField
                            type='text'
                            placeholder='Enter Name'
                            name={"name"}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <p>Enter PassCode</p>
                        <InputField
                            type='text'
                            placeholder='Enter PassCode'
                            name={"passCode"}
                        />
                    </div>
                    <Button text='Join Meeting' type={"Submit"} loading={meetLoading} />
                </form>
            </div>

        </div>
    )
}

export default JoinCall