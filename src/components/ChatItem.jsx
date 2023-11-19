import React from 'react'
import axiosInstance from '../api/axios'

const ChatItem = (props) => {
  return (
    <div onClick={() => props.onClick(props._id, props.name)} className='w-full max-w-full flex flex-row gap-5 border-b pb-3'>
      <img src={`${axiosInstance.defaults.baseURL}/upload/image/${props.avatar}`} alt="" className='w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]  object-cover rounded-full' />
      <div className='flex-1 flex-col gap-3 w-full max-w-full '>
        <div className='flex flex-1 justify-between flex-row items-center'>
          <p className='text-lg font-medium'>{props.name}</p>
          <p className='text-sm text-gray-400'>{props.time}</p>
        </div>
        <div className='flex flex-1 justify-between flex-row items-center w-full max-w-[100%]'>
          <p className='text-sm text-gray-400 max-w-[30%] line-clamp-1 text-ellipsis overflow-hidden'>{props?.lastMessage?.substring(0, 10)}...</p>
          {props.unreadCount > 0 && <div className='rounded-full flex items-center justify-center w-5 h-5 bg-[green] p-3'><p className='text-xs text-white'>{props.unreadCount}</p></div>}
        </div>
      </div>
    </div>
  )
}

export default ChatItem