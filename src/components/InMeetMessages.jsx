import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from "react-icons/io5";



function Message({ isMe, text, name, time }) {
    console.log(isMe)
    return (
        // <div className={`max-w-[100%] w-[100%] flex border`}>
            <div className={`max-w-[80%] w-[80%] bg-[blue] text-white flex flex-col gap-3 ${isMe ? 'rounded-lg rounded-tr-none self-end' : 'rounded-lg rounded-tl-none self-start'} p-2`}>
                <p className='text-sm'>
                    {name}
                </p>
                <p className={`max-w-[100%]`}>
                    {text}
                </p>
                <p className={`${isMe ? 'text-start' : 'text-end'} text-sm`}>
                    {time}
                </p>
            </div>
        // </div>
    )

}



function InMeetMessages({ messages, handleSendMessage }) {

    const [message, setMessage] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {

        if (scrollRef.current) {
            //if scrolled to top more than 10% of the total height then dont scroll to bottom else just scroll to bottom
            if (scrollRef.current.scrollTop > scrollRef.current.scrollHeight * 0.1) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            } else {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }

    }, [messages])


    return (
        <div className='flex-1 flex flex-col gap-10 max-h-full overflow-y-auto'>
            <p className='text-lg'>
                Messages
            </p>
            <div ref={scrollRef} className='flex-1 flex flex-col gap-10 max-h-full overflow-y-auto'>
                <div className='flex-1 flex flex-col gap-5'>
                    {messages.map((message, index) =>
                        <Message key={index} isMe={message.isMe} text={message.text} name={message.name} time={message.time} />
                    )}
                </div>
            </div>
            <div className='flex flex-row gap-1 bg-white items-center  border-2 border-gray-200 rounded-md px-2'>
                <input onKeyDown={(e)=>{
                    if(e.key==='Enter'){
                        message.length > 0 &&
                        handleSendMessage(message); setMessage('')
                    }
                }} type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Type a message' className='flex-1 p-2 outline-none' />
                <IoSend onClick={message.length > 0 ? () => { handleSendMessage(message); setMessage('') } : null} />
            </div>
        </div>
    )
}

export default InMeetMessages