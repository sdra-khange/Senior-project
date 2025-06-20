import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';
import './ChatNotifications.css';

const ChatNotifications = ({ selectedRoomId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    setupWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [selectedRoomId]);

  const setupWebSocket = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.access;
    wsRef.current = new WebSocket(`ws://localhost:8001/ws/notifications/`);
    wsRef.current.onopen = () => {
      wsRef.current.send(JSON.stringify({ type: 'authentication', token: token }));
    };
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message_notification') {
        // Ignore notifications for the currently open room
        if (selectedRoomId && data.room_id === selectedRoomId) return;
        setNotifications(prev => [
          {
            id: Date.now(),
            roomId: data.room_id,
            roomName: data.room_name,
            sender: data.sender,
            preview: data.message_preview,
            timestamp: new Date().toISOString()
          },
          ...prev.slice(0, 4)
        ]);
      }
    };
  };

  const handleNotificationClick = (roomId) => {
    console.log('Open chat room:', roomId);
    setNotifications(prev => prev.filter(n => n.roomId !== roomId));
  };

  const clearAllNotifications = () => setNotifications([]);

  return (
    <div className={`chat-notifications ${showPanel ? 'open' : ''}`}>
      <button className="notification-toggle" onClick={() => setShowPanel(!showPanel)}>
        <FaComments />
        {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
      </button>

      {showPanel && (
        <div className="notifications-panel">
          <div className="panel-header">
            <h3>Chat Notifications</h3>
            <div className="panel-actions">
              <button onClick={clearAllNotifications}>Clear All</button>
              <button onClick={() => setShowPanel(false)}><FaTimes /></button>
            </div>
          </div>

          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className="notification-item"
                  onClick={() => handleNotificationClick(notification.roomId)}
                >
                  <div className="notification-avatar"><FaComments /></div>
                  <div className="notification-content">
                    <div className="notification-title">New message in {notification.roomName}</div>
                    <div className="notification-preview"><strong>{notification.sender}:</strong> {notification.preview}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">No new notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatNotifications;