import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChatItem from '../components/ChatItem'
import { addMessage, selectChatById, selectChatMessages, selectFilterChats } from '../redux/slice/chat/chatSlice'
import { getAllChat, getMessages } from '../redux/slice/chat/chatAction'
import { useSocket } from '../context/socketContext'
import MessageItem from '../components/MessageItem'
import { HiOutlinePaperAirplane } from 'react-icons/hi'
import axiosInstance from '../api/axios'
import { SiGooglemessages } from 'react-icons/si'
import ModalWrapper from '../components/ModalWrapper'
import Loading from '../components/Loading'


// =========================================================
// SIDEBAR CHATS VIEW ======================================

const Chats = ({ chats, searchChange, onChatClick }) => {

    return (
        <div className='h-screen max-h-screen overflow-y-auto w-[40%] max-w-[40%] flex flex-col p-5 gap-5 shadow-md'>
            <p className='text-2xl font-bold'>Chats</p>
            <div className='flex rounded-md'>
                <input onChange={searchChange} type="text" placeholder='Search' className='flex-1 bg-gray-100 p-2 px-5 rounded-md outline-none' />
            </div>
            <div className='flex-1 flex flex-col gap-4 max-w-full w-full'>
                <p className='pt-5 text-xl font-bold'>People</p>
                <div className='flex flex-col gap-3 flex-1 overflow-y-auto max-w-full w-full'>
                    {
                        chats.map((chat =>
                            <ChatItem key={chat._id}
                                _id={chat._id}
                                onClick={onChatClick}
                                name={chat.participants[0]?.name}
                                avatar={chat.participants[0]?.avatar}
                                lastMessage={chat.lastMessage}
                                time={chat.lastMessageTime}
                                unreadCount={chat.unreadCount}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )

}

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


// =========================================================
// MESSAGES VIEW ===========================================

const MessagesDisplay = ({ data, onTextChange, send, clearText, displayAvatar, displayName, messageTextValue, chatId, participantId, loading, hasNextPage }) => {
    const messagesDivRef = React.useRef(null);
    const { userInfo } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const socket = useSocket();
    const [loaded, setLoaded] = React.useState(false);
    const [previosHeight, setPreviousHeight] = React.useState(0);


    const handleMessageSend = () => {
        dispatch(addMessage({ data: { messageData: { senderId: userInfo._id, message: messageTextValue, time: new Date().toLocaleString(), date: new Date().toLocaleString(), type: "Text" }, chatId } }));
        socket.emit("message", { data: { senderId: userInfo._id, message: messageTextValue, time: new Date(), date: new Date(), type: "Text", name: userInfo.name }, participantId: participantId, chatId: chatId })
        clearText();
        setTimeout(() => {
            //scroll to bottom after sending message and adding it to the list
            messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
        }, 100);

    }


    useEffect(() => {

        setLoaded(false);

    }, [chatId]);


    useEffect(() => {
        console.log("LOaded: ", loaded);
        if (loaded) {

            if (messagesDivRef.current) {

                let added = 0;
                if(messagesDivRef.current.scrollHeight !== previosHeight){
                    added = messagesDivRef.current.scrollHeight - previosHeight;
                    console.log("added: ", added);
                }
                console.log("if: ", messagesDivRef.current.scrollHeight - messagesDivRef.current.scrollTop <= messagesDivRef.current.clientHeight+added);
                //check if the user is at the bottom of the chat or not
                if (messagesDivRef.current.scrollHeight - messagesDivRef.current.scrollTop <= messagesDivRef.current.clientHeight+added) {
                    setTimeout(() => {
                        messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
                        setPreviousHeight(messagesDivRef.current.scrollHeight);
                    }, 100);
                }
            }


        } else {
            if (messagesDivRef.current) {

              

                if(data.length > 0){
                    setTimeout(() => {
                        messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
                        setLoaded(true);
                        setPreviousHeight(messagesDivRef.current.scrollHeight);
                        console.log("scrollHeight: ", messagesDivRef.current.scrollHeight);
                        console.log("scrollTop: ", messagesDivRef.current.scrollTop);
                        console.log("clientHeight: ", messagesDivRef.current.clientHeight);
                    }, 100);
                }
            }
        }
    }, [data]);

    return (<div className='flex-1 flex flex-col gap-3 p-5 h-screen max-h-screen overflow-hidden relative'>
        <div className='flex items-center justify-between'>
            <div className='flex flex-row items-center gap-3'>
                <img src={`${axiosInstance.defaults.baseURL}/upload/image/${displayAvatar}`} alt="" className='w-10 h-10 border object-cover rounded-full' />
                <p className='text-lg font-medium'>{displayName}</p>
            </div>
        </div>
        <div
            ref={messagesDivRef}
            onScroll={(e) => {
                if (e.target.scrollTop === 0 && hasNextPage && !loading) {
                    dispatch(getMessages({ chatId, cursor: data[data.length - 1]._id, limit: 40 })).then(() => {
                        console.log("Messages: ", data);
                    })
                }

            }}
            className='flex flex-1 flex-col overflow-y-auto gap-4 px-5'>
            {loading && <div className="flex self-center items-center justify-center">
                <Loading type="spin" loadingColor={"#0B5CFF"} size={40} />
            </div>}
            {
                data.map((message, index) => <MessageItem
                    key={index.toString()}
                    message={message.message}
                    time={formatAMPM(new Date(message.time))}
                    isMe={message.senderId?.toString() === userInfo._id?.toString()}
                />)
            }


        </div>
        <div className='flex items-center px-5'>
            <input onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    handleMessageSend()
                }
            }}
                value={messageTextValue}
                onChange={onTextChange} type="text" placeholder='Type a message...' className='flex-1 bg-gray-100 p-2 rounded-md outline-none' />
            <button onClick={handleMessageSend} disabled={!send} className='bg-primary p-2 rounded-full ml-2'>
                <HiOutlinePaperAirplane className='text-white' />
            </button>
        </div>
    </div>)
}



// =========================================================
// CHAT SCREEN =============================================


const Chat = () => {

    const dispatch = useDispatch();
    const socket = useSocket();
    const { loading: chatsLoading, chats, hasNextPage: chatsHasNextPage } = useSelector(state => state.chat);
    const [chatsSearch, setChatsSearch] = React.useState('');
    const [selectedChat, setSelectedChat] = React.useState({});
    const [text, setText] = React.useState('');
    let { loading: UserInfoLoading, userInfo } = useSelector(state => state.user);
    let messages = useSelector(state => selectChatMessages(state, selectedChat?.id));
    let thisChat = useSelector(state => selectChatById(state, selectedChat?.id));


    //chats handlers ======================================
    const searchChange = (e) => {
        setChatsSearch(e.target.value)
    }

    const displayChats = selectFilterChats(chats, chatsSearch);

    useEffect(() => {

        if (displayChats.length < 10 && !chatsLoading && chatsHasNextPage) {
            dispatch(getAllChat({ cursor: chats[chats.length - 1], limit: 20 }))
        }

    }, [displayChats]);

    const handleChatPress = (id, name) => {

        //if there is a selected chat and it is not the same as the one clicked
        if (selectedChat?.id && selectedChat?.id?.toString() !== id?.toString()) {
            socket.emit("chat-closed", { chatId: selectedChat?.id })
        }
        else if (!selectedChat?.id) {
            socket.emit('chat-opened', { chatId: id });
        }

        setSelectedChat({ id, name });
    }

    const chatsLoadMore = (cursor) => {
        if (chatsHasNextPage && !chatsLoading) {
            dispatch(getAllChat({ cursor, limit: 30 }))
        }
    }



    //===============================================================================
    //Chat handlers ======================================
    useEffect(() => {

        if (selectedChat?.id) {
            if ((messages?.length == 0 || !thisChat.messagesHasNextPage) && !chatsLoading) {
                dispatch(getMessages({ chatId: selectedChat?.id, limit: 40 }));
            }
        }

    }, [selectedChat?.id])


    const clearText = () => {
        setText('');
    }


    return (
        <div className='flex flex-row h-screen max-h-screen overflow-hidden'>
            <Chats
                chats={displayChats}
                searchChange={searchChange}
                onChatClick={handleChatPress}
            />
            <div className='flex-1 flex h-screen max-h-screen overflow-y-auto relative'>
                {
                    selectedChat.id ?
                        <MessagesDisplay
                            hasNextPage={thisChat?.messagesHasNextPage}
                            loading={chatsLoading}
                            chatId={selectedChat?.id}
                            participantId={thisChat?.participants[0]?._id}
                            data={[...messages].reverse()}
                            messageTextValue={text}
                            onTextChange={(e) => setText(e.target.value)}
                            send={text.length >= 1}
                            clearText={clearText}
                            displayAvatar={thisChat?.participants[0]?.avatar}
                            displayName={thisChat?.participants[0]?.name}
                        /> : <div className='flex-1 flex flex-col items-center justify-center gap-5'>
                            <SiGooglemessages className='text-9xl text-primary' />
                            <p className='text-lg font-semibold'>Select a chat to start messaging</p>
                        </div>

                }
            </div>

        </div>
    )
}

export default Chat