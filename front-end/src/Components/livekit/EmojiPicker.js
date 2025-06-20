import React, { useState, useRef, useEffect } from 'react';
import { FaSmile } from 'react-icons/fa';
import './EmojiPicker.css';

const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
  'Gestures': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  'Objects': ['💻', '📱', '⌚', '📷', '🎥', '📺', '🎮', '🕹️', '🎧', '🎤', '🎵', '🎶', '🎼', '🎹', '🥁', '🎸', '🎺', '🎷', '🎻', '🎪'],
  'Nature': ['🌱', '🌿', '🍀', '🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌾', '🌵', '🌲', '🌳', '🌴', '🌊', '🔥', '⭐', '🌟', '✨', '⚡']
};

const EmojiPicker = ({ onEmojiSelect, isOpen, onToggle }) => {
  const [activeCategory, setActiveCategory] = useState('Smileys');
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    onToggle();
  };

  if (!isOpen) {
    return (
      <button 
        className="emoji-toggle-button"
        onClick={onToggle}
        type="button"
        title="Add Emoji"
      >
        <FaSmile />
      </button>
    );
  }

  return (
    <div className="emoji-picker" ref={pickerRef}>
      <div className="emoji-categories">
        {Object.keys(EMOJI_CATEGORIES).map(category => (
          <button
            key={category}
            className={`emoji-category-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="emoji-grid">
        {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
          <button
            key={index}
            className="emoji-button"
            onClick={() => handleEmojiClick(emoji)}
            type="button"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
