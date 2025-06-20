import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  useChat,
  useLocalParticipant,
  useRemoteParticipants
} from '@livekit/components-react';
import { FaPaperPlane, FaComments, FaTimes } from 'react-icons/fa';
import { getUserInfo } from '../../utils/cookieUtils';
import EmojiPicker from './EmojiPicker';
import './ChatPanel.css';

const ChatPanel = ({ isOpen, onToggle }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { send, chatMessages, isSending } = useChat();
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const user = getUserInfo();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    try {
      await send(message.trim());
      setMessage('');
      setIsTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [message, send, isSending]);

  const handleInputChange = useCallback((e) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    if (!isTyping) {
      setIsTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }, [isTyping]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  }, [handleSendMessage]);

  const handleEmojiSelect = useCallback((emoji) => {
    setMessage(prev => prev + emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const toggleEmojiPicker = useCallback(() => {
    setIsEmojiPickerOpen(prev => !prev);
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getParticipantName = (participantId) => {
    if (localParticipant?.identity === participantId) {
      return user.username || 'You';
    }
    
    const participant = remoteParticipants.find(p => p.identity === participantId);
    return participant?.name || participant?.identity || 'Unknown';
  };

  const isOwnMessage = (participantId) => {
    return localParticipant?.identity === participantId;
  };

  if (!isOpen) {
    return (
      <button 
        className="chat-toggle-button"
        onClick={onToggle}
        title="Open Chat"
      >
        <FaComments />
        {chatMessages.length > 0 && (
          <span className="chat-badge">{chatMessages.length}</span>
        )}
      </button>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-title">
          <FaComments className="chat-icon" />
          <span>Chat</span>
          <span className="participant-count">
            ({(remoteParticipants.length + 1)} participants)
          </span>
        </div>
        <button 
          className="chat-close-button"
          onClick={onToggle}
          title="Close Chat"
        >
          <FaTimes />
        </button>
      </div>

      <div className="chat-messages">
        {chatMessages.length === 0 ? (
          <div className="chat-empty-state">
            <FaComments className="empty-icon" />
            <p>No messages yet</p>
            <p className="empty-subtitle">Start the conversation!</p>
          </div>
        ) : (
          chatMessages.map((msg, index) => (
            <div 
              key={index}
              className={`chat-message ${isOwnMessage(msg.from?.identity) ? 'own-message' : 'other-message'}`}
            >
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">
                    {getParticipantName(msg.from?.identity)}
                  </span>
                  <span className="message-time">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div className="message-text">
                  {msg.message}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <div className="chat-input-container">
          <div className="input-with-emoji">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="chat-input"
              disabled={isSending}
              maxLength={500}
            />
            <EmojiPicker
              isOpen={isEmojiPickerOpen}
              onToggle={toggleEmojiPicker}
              onEmojiSelect={handleEmojiSelect}
            />
          </div>
          <button
            type="submit"
            className="chat-send-button"
            disabled={!message.trim() || isSending}
            title="Send Message"
          >
            {isSending ? (
              <div className="sending-spinner" />
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
        {message.length > 400 && (
          <div className="character-count">
            {message.length}/500
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatPanel;
