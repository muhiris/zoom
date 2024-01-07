import React, { useEffect, useRef, useState } from 'react'
import MyStreamView from '../components/MyStreamView';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { joinMeet } from '../redux/slice/meet/meetAction';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toast';
import { useStream } from '../context/streamContext';

const JoinCall = (props) => {

   
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading: meetLoading, meet, error: meetError } = useSelector(state => state.meet);
    const {stream,startLocalMediaStream,destroyingMediaStream,toggleCamera,toggleMicrophone,toggleSound,camera,sound,microphone} = useStream();



    const handleJoinMeeting = (e) => {
        e.preventDefault();

        const payload = {
            meetId: e.target.meetingId.value,
            passcode: e.target.passCode.value || null,
            type: 'internal',
        }

        if (props?.from === "Call") {

            props.joinMeeting({ ...payload, name: e.target.name.value }, camera, microphone, sound)

        } else {

            //* Type is set Internal here because we are joining a meeting by id so doesnot matter if it was a scheduled one or not
            dispatch(joinMeet(payload)).then((res) => {
                if (joinMeet.fulfilled.match(res)) {
                    if (res.payload.data.access) {

                        navigate(`/call/${res?.payload?.data?.meet?._id}`, { state: { video: camera, audio: microphone, meetId: payload.meetId, name: e.target.name.value, hostId: res?.payload?.data?.meet?.host } });
                    } else {
                        toast.error('You are not allowed to join this meeting');
                    }
                }
            })
        }
    }



    useEffect(() => {

        startLocalMediaStream();

        return () => {
            destroyingMediaStream();
        }
    }, [])


    return (
        <div className='flex flex-1 flex-col md:flex-row  gap-10 p-20'>
            <div>
                <MyStreamView
                    style={{ flex: 1 }}
                    joinCallScreen={true}
                    src={stream}
                    microphone={microphone}
                    toggleMicrophone={toggleMicrophone}
                    toggleCamera={toggleCamera}
                    camera={camera}
                    speaker={sound}
                    toggleSpeaker={toggleSound}
                />
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
                            disabled={props?.meetId ? true : false}
                            defaultValue={props?.meetId}
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