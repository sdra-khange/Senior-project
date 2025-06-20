import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaUsers,
  FaUser,
  FaEllipsisV,
  FaArrowLeft,
  FaExclamationTriangle
} from 'react-icons/fa';
import chatService from '../../services/chatService';
import { getUserInfo } from '../../utils/cookieUtils';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatRoom.css';
import { useChat } from '../../contexts/ChatContext';

const ChatRoom = ({ room, onBack }) => {
  const { updateRoom } = useChat();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const messagesEndRef = useRef(null);
  const user = getUserInfo();
  const messagesPerPage = 20;

  const loadMessages = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await chatService.getMessages(room.id, pageNum, messagesPerPage);
      
      if (pageNum === 1) {
        setMessages(response.messages);
      } else {
        setMessages(prev => [...prev, ...response.messages]);
      }
      
      setHasMore(response.messages.length === messagesPerPage);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [room?.id, messagesPerPage]);

  const markMessagesAsRead = useCallback(async () => {
    if (room?.id) {
      try {
        await chatService.markMessagesAsRead(room.id);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  }, [room?.id]);

  const handleNewMessage = useCallback((message) => {
    console.log('New message received:', message);
    if (message.room_id === room?.id) {
      setMessages(prevMessages => {
        // Check if message already exists
        const messageExists = prevMessages.some(m => m.id === message.id);
        if (messageExists) {
          return prevMessages;
        }
        return [...prevMessages, message];
      });
      
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [room?.id]);

  const handleRoomUpdate = useCallback((updatedRoom) => {
    console.log('Room update received:', updatedRoom);
    if (updatedRoom.id === room?.id) {
      updateRoom(updatedRoom.id, updatedRoom);
    }
  }, [room?.id, updateRoom]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMessages(page + 1);
    }
  }, [loading, hasMore, loadMessages, page]);

  const handleSendMessage = useCallback(async (content) => {
    if (!content.trim() || !room || sending) return;

    try {
      setSending(true);
      const messageData = {
        content: content.trim(),
        message_type: 'text'
      };

      const sentMessage = await chatService.sendMessage(room.id, messageData);
      console.log('Message sent successfully:', sentMessage);

      setMessages(prevMessages => [...prevMessages, sentMessage]);
      updateRoom(room.id, { last_message: sentMessage });
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  }, [room, sending, updateRoom]);

  useEffect(() => {
    if (room?.id) {
      chatService.subscribeToMessages(handleNewMessage, room.id);
      chatService.subscribeToRoomUpdates(handleRoomUpdate, room.id);
      loadMessages(1);
      markMessagesAsRead();
      // Set up interval for refreshing messages every 8 seconds
      const interval = setInterval(() => {
        loadMessages(1);
      }, 8000);
      return () => {
        chatService.unsubscribeFromMessages(handleNewMessage);
        chatService.unsubscribeFromRoomUpdates(handleRoomUpdate);
        clearInterval(interval);
      };
    }
  }, [room?.id, handleNewMessage, handleRoomUpdate, loadMessages, markMessagesAsRead]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const messageList = document.querySelector('.message-list');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  const getRoomDisplayName = () => {
    if (room.room_type === 'individual') {
      const otherParticipant = room.participants.find(p => p.user.id !== user.id);
      return otherParticipant ? otherParticipant.user.username : 'Unknown User';
    }
    return room.name;
  };

  const getRoomIcon = () => {
    return room.room_type === 'individual' ? <FaUser /> : <FaUsers />;
  };

  const getParticipantCount = () => {
    return room.participants.filter(p => p.is_active).length;
  };

  if (!room) {
    return (
      <div className="chat-room-empty">
        <FaUsers className="empty-icon" />
        <h3>Select a conversation</h3>
        <p>Choose a conversation from the list to start messaging</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-room-error">
        <FaExclamationTriangle />
        <p>{error}</p>
        <button onClick={() => loadMessages()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="chat-room">
      <div className="chat-room-header">
        <button 
          className="back-button mobile-only"
          onClick={onBack}
          title="Back to conversations"
        >
          <FaArrowLeft />
        </button>
        
        <div className="room-info">
          <div className="room-avatar">
            {getRoomIcon()}
          </div>
          <div className="room-details">
            <h3 className="room-title">{getRoomDisplayName()}</h3>
            <p className="room-subtitle">
              {room.room_type === 'individual' 
                ? 'Direct message' 
                : `${getParticipantCount()} participants`
              }
            </p>
          </div>
        </div>

        <button 
          className="room-menu-button"
          onClick={() => setShowRoomInfo(!showRoomInfo)}
          title="Room options"
        >
          <FaEllipsisV />
        </button>
      </div>

      <div className="chat-room-content">
        <MessageList 
          messages={messages}
          currentUser={user}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loading={loading}
        />
        <div ref={messagesEndRef} />
      </div>

      <MessageInput 
        onSendMessage={handleSendMessage}
        disabled={sending}
        placeholder={`Message ${getRoomDisplayName()}...`}
      />

      {showRoomInfo && (
        <div className="room-info-panel">
          <div className="room-info-header">
            <h4>Room Information</h4>
            <button onClick={() => setShowRoomInfo(false)}>×</button>
          </div>
          <div className="room-info-content">
            <div className="info-item">
              <h5>Room Name</h5>
              <p>{room.name}</p>
            </div>
            <div className="info-item">
              <h5>Type</h5>
              <p>{room.room_type === 'individual' ? 'Direct Message' : 'Group Chat'}</p>
            </div>
            <div className="info-item">
              <h5>Participants</h5>
              <ul>
                {room.participants.map(participant => (
                  <li key={participant.user.id}>
                    {participant.user.username}
                    {participant.is_admin && ' (Admin)'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;



