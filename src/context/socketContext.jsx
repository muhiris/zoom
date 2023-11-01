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
  const {userInfo} = useSelector(state => state.user);
  const [socketConnection, setSocketConnection] = useState(null);

  useEffect(() => {
    if(!userInfo._id || socket.connected ) return;
    console.log('SocketProvider: connecting...');
    const socketConnection = socket.connect();
    setSocketConnection(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socketConnection}>
      {children}
    </SocketContext.Provider>
  );
}
