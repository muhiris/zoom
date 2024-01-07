import { useEffect, useState } from "react";
import { useSocket } from "../context/socketContext";
import { useSelector } from "react-redux";
import Button2 from "./Button2";
import { IoIosAddCircle } from "react-icons/io";
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill, BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";


const ListItem = ({ item, handleAddUser, loading, enableAdd, meetId, isHost, thisIsHost, allMuted, allVideoOff }) => {

    const socket = useSocket();
    const [mic, setMic] = useState(true);
    const [video, setVideo] = useState(true);


    useEffect(() => {

        if (allMuted) {
            setMic(false);
        } else {
            setMic(true);
        }

    }, [allMuted]);

    useEffect(() => {
            
            if (allVideoOff) {
                setVideo(false);
            } else {
                setVideo(true);
            }
    }, [allVideoOff]);


    const handleMic = () => {
        socket.emit('mic', { users: [item.userId], action: mic ? "mute" : "unmute", meetId });
        setMic(!mic);
    }

    const handleVideo = () => {
        socket.emit('video', { users: [item.userId], action: video ? "pause" : "resume", meetId });
        setVideo(!video);
    }


    return (
        <div className="flex flex-row items-center justify-between flex-1">
            <p className="text-md">{
                item.name + (thisIsHost ? " (Host)" : "")
            }</p>
            <div className="flex flex-row items-center gap-4">
                <IoIosAddCircle onClick={() => handleAddUser(item.userId)} className="text-2xl text-primary cursor-pointer" />
                {
                    isHost && (
                        mic ?
                            <BsFillMicFill className="text-2xl text-primary cursor-pointer" onClick={() => handleMic()} />
                            :
                            <BsFillMicMuteFill className="text-2xl text-primary cursor-pointer" onClick={() => handleMic()} />
                    )
                }
                {
                    isHost && (
                        video ?
                            <BsFillCameraVideoFill className="text-2xl text-primary cursor-pointer" onClick={() => handleVideo()} />
                            :
                            <BsFillCameraVideoOffFill className="text-2xl text-primary cursor-pointer" onClick={() => handleVideo()} />
                    )
                }
            </div>
        </div>
    )
}


const ParticipantDrawer = ({ participants, isHost, meetId, style, hostId }) => {
    const socket = useSocket();
    const { loading, chats } = useSelector(state => state.chat);
    const { userInfo } = useSelector(state => state.user);
    const [userClicked, setUserClicked] = useState(false);
    const [allMuted, setAllMuted] = useState(false);
    const [allVideoOff, setAllVideoOff] = useState(false);



    const handleAddUser = (id) => {
        socket.emit('createChat', { userId: userInfo.id, participantId: id });
    }

    const handleVideoOffAll = () => {
        socket.emit('video', { users: participants.map((item) => item.userId), action: allVideoOff ? "resume" : "pause", meetId });
        setAllVideoOff(!allVideoOff);
    }

    const handleMuteAll = () => {
        socket.emit('mic', { users: participants.map((item) => item.userId), action: allMuted ? "unmute" : "mute", meetId });
        setAllMuted(!allMuted);
    }

    console.log("allMuted", allMuted);

    return (
        <div style={style} className="flex-1 flex flex-col gap-4 max-h-full overflow-hidden">
            <p className="text-lg">Participants</p>
            {isHost && <div className="flex flex-row items-center justify-center gap-3">
                <Button2 onClick={() => handleMuteAll()} style={{ flex: 1 }} text={allMuted ? "Unmute All" : "Mute All"} />
                <Button2 onClick={() => handleVideoOffAll()} style={{ flex: 1 }} text={allVideoOff ? "Resume Video" : "Pause Video"} />
            </div>}
            <div className="flex flex-col gap-4 overflow-y-auto">
                {
                    participants.map((item) =>
                        <ListItem key={item?.userId?.toString()}
                            item={item} handleAddUser={handleAddUser} loading={(item.userId == userClicked && loading) ? loading : false}
                            enableAdd={[...chats].filter((chat) => chat?.participants?.includes(item.userId)).length > 0 ? false : true}
                            meetId={meetId}
                            isHost={isHost}
                            allMuted={allMuted}
                            allVideoOff={allVideoOff}
                            thisIsHost={hostId == item.userId}
                        />
                    )
                }
            </div>
        </div>
    )

}

export default ParticipantDrawer;