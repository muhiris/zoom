import React from 'react'

const MessageItem = (props) => {
    return (
        <div
            style={{
                alignSelf: props.isMe ? 'flex-end' : 'flex-start',
            }}
            className='min-w-[30%] max-w-[70%] flex flex-col gap-1'>
            <div style={{
                backgroundColor: props.isMe ? "#E7E7E7" : "#0B5CFF",
                color: props.isMe ? "#000" : "#fff",
            }} className='p-3 rounded-md'>
                <p className='text-sm break-words'>{props.message}</p>
            </div>
            <p
                style={{
                    alignSelf: props.isMe ? 'flex-end' : 'flex-start',
                }}
                className='text-xs text-gray-400'>{props.time}</p>
        </div>
    )
}

export default MessageItem