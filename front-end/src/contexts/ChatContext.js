import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  const updateRoom = (roomId, updatedData) => {
    setRooms(prev =>
      prev.map(room =>
        room.id === roomId ? { ...room, ...updatedData } : room
      )
    );
  };

  const updateUnreadCount = (roomId, count) => {
    setUnreadCounts(prev => ({ ...prev, [roomId]: count }));
  };

  return (
    <ChatContext.Provider
      value={{
        rooms,
        setRooms,
        updateRoom,
        unreadCounts,
        updateUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext); 