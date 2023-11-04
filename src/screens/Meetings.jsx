import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Button2 from '../components/Button2';
import { joinMeet } from '../redux/slice/meet/meetAction';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllSchedule } from '../redux/slice/schedule/scheduleAction';
import ModalWrapper from '../components/ModalWrapper';
import Loading from '../components/Loading';


function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function formatDate(date) {
    const today = new Date();

    if (date === today) {
        return `Today, ${date.toLocaleDateString('default', { day: 'long' })}`;
    } else {
        return date.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
}

const ScheduleListItem = (props) => {
    return (
        <div className='flex flex-row justify-between items-center py-3'>
            <div className='flex flex-1 flex-row items-center'>
                <p className="flex flex-col items-center text-sm min-w-[100px] max-w-[100px]">{formatAMPM(new Date(props.from))}</p>
                <div style={{ maxWidth: "100%" }}>
                    <p className='text-sm'>{formatDate(new Date(props.date))}</p>
                    <p className='text-base mb-1 font-semibold'>{props.title}</p>
                    <p className='text-ellipsis line-clamp-1 text-sm'>Meeting ID: {props._id}</p>
                </div>
            </div>
            <Button2 loading={props.clicked && props.loading} disabled={!props.clicked && props.loading} text="Join" onClick={() => props.onJoin(props._id, props.requirePasscode)} style={{ paddingHorizontal: 15, paddingVertical: 5, width:100 }} />
        </div>
    )
}




const Meetings = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading: scheduleLoading, schedules, hasNextPage: schedulesHasNextPage, error: scheduleError } = useSelector(state => state.schedule);
    const { userInfo } = useSelector(state => state.user);
    const {loading:meetLoading} = useSelector(state=>state.meet);
    const [password, setPassword] = useState('');
    const [passwordModal, setPasswordModal] = useState(false);
    const [modalFor, setModalFor] = useState({
        id: null,
        requirePasscode: false,
    });
    const [id, setId] = useState('');

    const handleJoinMeet = (id, requirePasscode) => {
        if (requirePasscode && password.length == 0) {
            setPassword('');
            setPasswordModal(true);
            setModalFor({ id, requirePasscode });
            return;
        }
        setId(id);
        dispatch(joinMeet({ meetId: id, type: 'scheduled', passcode: password })).then((res) => {
            setPassword('');
            if (joinMeet.fulfilled.match(res)) {

                if (res.payload.data.access) {
                    setPassword('');
                    setId(null);
                    navigate(`/call/${res.payload?.data?.meet?._id}`, {state:{ video: true, audio: true, meetId: res.payload.data.meet._id, name: userInfo.name }});
                } else {
                    toast.error("You are not allowed to join this meeting");
                    setId(null);
                    setPassword('');
                }
            }
        }).catch((err) => {
            console.log(err);
            setId(null);
        })
        setPasswordModal(false);
        setModalFor({ id: null, requirePasscode: false });

    }

    const scheduleLoadMore = (cursor) => {
        if (schedulesHasNextPage && !scheduleLoading) {
            dispatch(getAllSchedule({ cursor, limit: 20 }))
        }
    }



    return (
        <div className='flex h-screen max-h-screen overflow-hidden flex-col gap-4 relative p-10'>
            <div className="flex flex-1 flex-col gap-5">
                <p className="text-2xl font-bold">Schedules Meetings</p>
                <div className="flex flex-1 flex-col gap-3">
                    {
                        schedules?.map((schedule, index) =>
                            <ScheduleListItem key={index.toString()} {...schedule} loading={scheduleLoading} clicked={id?.toString() === schedule._id.toString()} onJoin={(id, requirePasscode) => handleJoinMeet(id, requirePasscode)} />
                        )}
                </div>
            </div>

            <ModalWrapper isOpen={passwordModal}>

                <form
                className='flex flex-col gap-3 bg-white p-5 rounded-md'
                onSubmit={(e)=>{
                    e.preventDefault();
                    handleJoinMeet(modalFor.id, modalFor.requirePasscode);
                    
                }}>

                    <div className="flex flex-col gap-3">
                        <p className="text-2xl font-bold">Enter Passcode</p>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-2 border-gray-300 rounded-md p-2" />
                        <div className="flex flex-row gap-3">
                            <Button2 style={{width:100}} text="Cancel" transparent onClick={() => setPasswordModal(false)} />
                            <Button2 style={{width:100}} type={"Submit"} text="Join" onClick={() => handleJoinMeet(modalFor.id, modalFor.requirePasscode)} loading={meetLoading}  />
                        </div>
                    </div>

                </form>

            </ModalWrapper>

        </div>
    )
}

export default Meetings