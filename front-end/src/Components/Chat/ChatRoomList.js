import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaPlus, 
  FaUsers, 
  FaUser, 
  FaComments, 
  FaSearch,
  FaSpinner,
  FaExclamationTriangle
} from 'react-icons/fa';
import chatService from '../../services/chatService';
import { getUserInfo } from '../../utils/cookieUtils';
import './ChatRoomList.css';
import { useChat } from '../../contexts/ChatContext';

const ChatRoomList = ({ onRoomSelect, onCreateRoom, selectedRoomId }) => {
  const { rooms, setRooms } = useChat();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const user = getUserInfo();

  const loadChatRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const roomsData = await chatService.getChatRooms();
      console.log('Loaded chat rooms:', roomsData); // Debug log

      // Ensure roomsData is an array
      const roomsArr = Array.isArray(roomsData) ? roomsData : [];
      setRooms(roomsArr);
    } catch (err) {
      setError('Failed to load chat rooms');
      console.error('Error loading chat rooms:', err);
      setRooms([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [setRooms]);

  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  useEffect(() => {
    // Filter rooms based on search term
    const filtered = rooms.filter(room => {
      if (!room) return false;

      const nameMatch = room.name && room.name.toLowerCase().includes(searchTerm.toLowerCase());
      const participantMatch = room.participants && Array.isArray(room.participants) &&
        room.participants.some(p =>
          p && p.user && p.user.username &&
          p.user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return nameMatch || participantMatch;
    });
    setFilteredRooms(filtered);
  }, [rooms, searchTerm]);

  const handleRoomClick = (room) => {
    onRoomSelect(room);
  };

  // Updated unread count logic
  const getUnreadCount = (room) => {
    if (!room.participants) return 0;
    const participant = room.participants.find(p => p.user && p.user.id === user.id);
    if (!participant || !room.last_message) return 0;
    const lastReadTime = participant.last_read_at ? new Date(participant.last_read_at) : null;
    const lastMessageTime = new Date(room.last_message.created_at);
    if (!lastReadTime) return 1; // If never read, consider as unread
    return lastMessageTime > lastReadTime ? 1 : 0;
  };

  const getRoomDisplayName = (room) => {
    if (room.room_type === 'individual') {
      if (room.participants && Array.isArray(room.participants)) {
        const otherParticipant = room.participants.find(p => p.user && p.user.id !== user.id);
        return otherParticipant && otherParticipant.user ? otherParticipant.user.username : 'Unknown User';
      }
      return 'Unknown User';
    }
    return room.name || 'Unnamed Room';
  };

  const getRoomIcon = (room) => {
    return room.room_type === 'individual' ? <FaUser /> : <FaUsers />;
  };

  const getLastMessage = (room) => {
    if (room.last_message) {
      return {
        content: room.last_message.content,
        time: chatService.formatRoomLastActivity(room.last_message.created_at),
        sender: room.last_message.sender ? room.last_message.sender.username : 'Unknown'
      };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="chat-room-list-loading">
        <FaSpinner className="spinner" />
        <p>Loading chat rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-room-list-error">
        <FaExclamationTriangle />
        <p>{error}</p>
        <button onClick={loadChatRooms} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="chat-room-list">
      <div className="chat-room-list-header">
        <h3>
          <FaComments className="header-icon" />
          Messages
        </h3>
        {user.user_type === 'doctor' && (
          <button 
            className="create-room-button"
            onClick={onCreateRoom}
            title="Create new chat"
          >
            <FaPlus />
          </button>
        )}
      </div>

      <div className="chat-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="chat-room-list-content">
        {filteredRooms.length === 0 ? (
          <div className="no-rooms">
            <FaComments className="no-rooms-icon" />
            <p>No conversations yet</p>
            {user.user_type === 'doctor' && (
              <button 
                className="start-chat-button"
                onClick={onCreateRoom}
              >
                Start a conversation
              </button>
            )}
          </div>
        ) : (
          filteredRooms.map(room => {
            const lastMessage = getLastMessage(room);
            const unreadCount = getUnreadCount(room);
            const isSelected = selectedRoomId === room.id;

            return (
              <div
                key={room.id}
                className={`chat-room-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleRoomClick(room)}
              >
                <div className="room-avatar">
                  {getRoomIcon(room)}
                </div>
                
                <div className="room-info">
                  <div className="room-header">
                    <h4 className="room-name">
                      {getRoomDisplayName(room)}
                    </h4>
                    {lastMessage && (
                      <span className="last-message-time">
                        {lastMessage.time}
                      </span>
                    )}
                  </div>
                  
                  <div className="room-preview">
                    {lastMessage ? (
                      <p className="last-message">
                        <span className="sender-name">
                          {lastMessage.sender === user.username ? 'You' : lastMessage.sender}:
                        </span>
                        <span className="message-content">
                          {lastMessage.content}
                        </span>
                      </p>
                    ) : (
                      <p className="no-messages">No messages yet</p>
                    )}
                    
                    {unreadCount > 0 && (
                      <span className="unread-badge">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {user.user_type === 'doctor' && (
        <button className="mobile-create-button" onClick={onCreateRoom} title="Create new chat">
          <FaPlus />
        </button>
      )}
    </div>
  );
};

export default ChatRoomList;

