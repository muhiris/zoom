// PeerContext.js
import React, { createContext, useContext, useState } from 'react';

const PeerContext = createContext();

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
  const [peerData, setPeerData] = useState({});

  const addPeerData = (socketId, stream, userId, name,loading) => {
    setPeerData((prevData) => ({
      ...prevData,
      [userId]: { ...prevData[userId], stream, userId, socketId, name, loading },
    }));
  };

  const ChangeLoadingState = (userId, loading) => {
    setPeerData((prevData) => ({
      ...prevData,
      [userId]: { ...prevData[userId], loading },
    }));
  }

  const removePeerData = (userId) => {
    setPeerData((prevData) => {
      const newData = { ...prevData };
      delete newData[userId];
      return newData;
    });
  };

  const removeAllPeerData = () => {
    setPeerData({});
  }

  const addPeerConnection = (userId, connection) => {
    setPeerData((prevData) => ({
      ...prevData,
      [userId]: { ...prevData[userId], connection },
    }));
  }


  return (
    <PeerContext.Provider value={{ peerData, addPeerData, removePeerData, removeAllPeerData, addPeerConnection, ChangeLoadingState }}>
      {children}
    </PeerContext.Provider>
  );
};
