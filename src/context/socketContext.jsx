//socket.io client context

// SocketContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../socket/socket';
import { useSelector } from 'react-redux';


const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socketConnection, setSocketConnection] = useState(null);
  const { userInfo } = useSelector(state => state.user);

  useEffect(() => {
    console.log('SocketProvider: userInfo', userInfo);
    console.log('SocketProvider: socket.connected', socket.connected);
    if(!userInfo?._id ) return;
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
