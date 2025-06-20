import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSmile, FaSpinner } from 'react-icons/fa';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, disabled, placeholder = "Type a message..." }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Common emojis for quick access
  const quickEmojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🤔'];

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const handleInputChange = (e) => {
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage('');
    setIsTyping(false);
    
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="message-input-container">
      {showEmojiPicker && (
        <div className="emoji-picker">
          <div className="emoji-picker-header">
            <span>Quick Emojis</span>
            <button 
              className="close-emoji-picker"
              onClick={() => setShowEmojiPicker(false)}
            >
              ×
            </button>
          </div>
          <div className="emoji-grid">
            {quickEmojis.map((emoji, index) => (
              <button
                key={index}
                className="emoji-button"
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <form className="message-input-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <button
            type="button"
            className="emoji-toggle-button"
            onClick={toggleEmojiPicker}
            title="Add emoji"
          >
            <FaSmile />
          </button>
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="message-textarea"
            disabled={disabled}
            maxLength={1000}
            rows={1}
          />
          
          <button
            type="submit"
            className="send-button"
            disabled={!message.trim() || disabled}
            title="Send message"
          >
            {disabled ? (
              <FaSpinner className="spinner" />
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
        
        {message.length > 800 && (
          <div className="character-count">
            {message.length}/1000
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageInput;
