import React, { useState, useEffect } from 'react';
import { FaComments } from 'react-icons/fa';
import SidebarDoctor from '../SidebarDoctor';
import Navbar from '../NavBardoctor';
import ChatRoomList from '../../../../Components/Chat/ChatRoomList';
import ChatRoom from '../../../../Components/Chat/ChatRoom';
import CreateChatModal from '../../../../Components/Chat/CreateChatModal';
import './ChatDoctor.css';

const ChatDoctor = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showRoomList, setShowRoomList] = useState(true);
  const [refreshRooms, setRefreshRooms] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setShowRoomList(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    if (isMobileView) {
      setShowRoomList(false);
    }
  };

  const handleBackToList = () => {
    if (isMobileView) {
      setShowRoomList(true);
      setSelectedRoom(null);
    }
  };

  const handleCreateRoom = () => {
    setShowCreateModal(true);
  };

  const handleRoomCreated = (newRoom) => {
    setShowCreateModal(false);
    setSelectedRoom(newRoom);
    setRefreshRooms(prev => !prev);
    if (isMobileView) {
      setShowRoomList(false);
    }
  };

  const handleRoomUpdate = (roomId, lastMessage) => {
    // Update room list when a new message is sent
    setRefreshRooms(prev => !prev);
  };

  return (
    <div className="doctor-profile-page">
      <SidebarDoctor />
      <Navbar />
      <div className="doctor-profile-main-content">
        <div className="chat-doctor-container">
          <div className="chat-doctor-header">
            <div className="chat-header-content">
              <FaComments className="chat-header-icon" />
              <div className="chat-header-text">
                <h2>Doctor Chat</h2>
                <p>Communicate with your patients and manage conversations</p>
              </div>
            </div>
          </div>

          <div className="chat-doctor-content">
            <div className={`chat-sidebar ${isMobileView && !showRoomList ? 'hidden' : ''}`}>
              <ChatRoomList
                onRoomSelect={handleRoomSelect}
                onCreateRoom={handleCreateRoom}
                selectedRoomId={selectedRoom?.id}
                refresh={refreshRooms}
              />
            </div>

            <div className={`chat-main ${isMobileView && showRoomList ? 'hidden' : ''}`}>
              <ChatRoom
                room={selectedRoom}
                onBack={handleBackToList}
                onRoomUpdate={handleRoomUpdate}
              />
            </div>
          </div>

          {showCreateModal && (
            <CreateChatModal
              onClose={() => setShowCreateModal(false)}
              onRoomCreated={handleRoomCreated}
              userType="doctor"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDoctor;
