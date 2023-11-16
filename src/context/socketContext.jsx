//socket.io client context

// SocketContext.js
import { createContext, useContext, useEffect, useState } from 'react';
// import { socket } from '../socket/socket';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axiosInstance from '../api/axios';
import { get } from '../redux/reuseable';


const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socketConnection, setSocketConnection] = useState(null);
  const { userInfo } = useSelector(state => state.user);

  useEffect(() => {
    
    const socket = io(axiosInstance.defaults.baseURL, {
      auth: async (cb) => {
        cb({
          token: await get("accessToken"),
        });
      },
    });
    
    if(!userInfo?._id  ) return;
    console.log('SocketProvider: connecting...');
    const socketConnection = socket.connect();
    setSocketConnection(socketConnection);

    return () => {
      if(socket.connected && userInfo?._id){
        socketConnection.disconnect();
      }
    };
  }, [userInfo?._id]);

  return (
    <SocketContext.Provider value={socketConnection}>
      {children}
    </SocketContext.Provider>
  );
}
