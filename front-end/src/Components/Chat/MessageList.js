import React, { useEffect, useRef, useState } from 'react';
import { FaUser, FaArrowDown } from 'react-icons/fa';
import chatService from '../../services/chatService';
import './MessageList.css';

const MessageList = ({ messages, currentUser, onLoadMore, hasMore, loading }) => {
  const messagesEndRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Sort messages from oldest to newest
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.created_at) - new Date(b.created_at)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsAtBottom(true);
    setShowScrollIndicator(false);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottom(isBottom);
    setShowScrollIndicator(!isBottom);
    // Infinite scroll: load more when at top
    if (scrollTop < 30 && hasMore && !loading) {
      onLoadMore();
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  const isOwnMessage = (message) => {
    if (!message?.sender || !currentUser?.id) {
      return false;
    }
    return message.sender.id === currentUser.id;
  };

  const getMessageSender = (message) => {
    if (!message.sender) return 'Unknown';
    return message.sender.username;
  };

  const shouldShowAvatar = (message, index) => {
    if (index === 0) return true;
    const prevMessage = sortedMessages[index - 1];
    return !prevMessage.sender || !message.sender || prevMessage.sender.id !== message.sender.id;
  };

  const shouldShowTimestamp = (message, index) => {
    if (index === 0) return true;
    const prevMessage = sortedMessages[index - 1];
    const timeDiff = new Date(message.created_at) - new Date(prevMessage.created_at);
    return timeDiff > 5 * 60 * 1000; // 5 minutes
  };

  const formatMessageTime = (timestamp) => {
    return chatService.formatMessageTime(timestamp);
  };

  const renderMessage = (message, index) => {
    // Handle null or invalid messages
    if (!message || !message.id) {
      return null;
    }

    const isOwn = isOwnMessage(message);
    const showAvatar = shouldShowAvatar(message, index);
    const showTimestamp = shouldShowTimestamp(message, index);

    if (message.message_type === 'system') {
      return (
        <div key={message.id} className="system-message">
          <span className="system-message-content">{message.content}</span>
          <span className="system-message-time">
            {formatMessageTime(message.created_at)}
          </span>
        </div>
      );
    }

    return (
      <div key={message.id} className={`message-wrapper ${isOwn ? 'own' : 'other'}`}>
        {showTimestamp && (
          <div className="message-timestamp">
            {formatMessageTime(message.created_at)}
          </div>
        )}
        
        <div className="message-container">
          {!isOwn && showAvatar && (
            <div className="message-avatar">
              <FaUser />
            </div>
          )}
          
          <div className={`message-bubble ${!isOwn && !showAvatar ? 'no-avatar' : ''}`}>
            {!isOwn && showAvatar && (
              <div className="message-sender">
                {getMessageSender(message)}
                {message.sender?.user_type && (
                  <span className="sender-type">
                    ({message.sender.user_type})
                  </span>
                )}
              </div>
            )}
            
            <div className="message-content">
              {message.content}
            </div>
            
            <div className="message-meta">
              <span className="message-time">
                {new Date(message.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
              {isOwn && message.read_status && (
                <span className="read-status">
                  {message.read_status.length > 0 ? '✓✓' : '✓'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="message-list-container">
      <div className="message-list" onScroll={handleScroll}>
        {sortedMessages.map((message, index) => renderMessage(message, index))}
        <div ref={messagesEndRef} />
      </div>

      {showScrollIndicator && (
        <button 
          className="scroll-to-bottom-button"
          onClick={scrollToBottom}
          title="Scroll to latest message"
        >
          <FaArrowDown />
        </button>
      )}
    </div>
  );
};

export default MessageList;
