import React, { useState, useEffect } from 'react';
import { FaComments } from 'react-icons/fa';
import SidebarPatient from '../SidebarPatient';
import Navbar from '../NavBarPatient';
import ChatRoomList from '../../../../Components/Chat/ChatRoomList';
import ChatRoom from '../../../../Components/Chat/ChatRoom';
import './ChatPatient.css';

const ChatPatient = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showRoomList, setShowRoomList] = useState(true);

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

  const handleRoomUpdate = (roomId, lastMessage) => {
    // Update the room list when a new message is sent
    console.log('Room updated:', roomId, lastMessage);
  };

  // Patients cannot create rooms, only doctors can
  const handleCreateRoom = () => {
    console.log('Patients cannot create chat rooms');
  };

  return (
    <div className="patient-profile-page">
      <SidebarPatient />
      <Navbar />
      <div className="patient-profile-main-content">
        <div className="chat-patient-container">
          <div className="chat-patient-header">
            <div className="chat-header-content">
              <FaComments className="chat-header-icon" />
              <div className="chat-header-text">
                <h2>My Conversations</h2>
                <p>Chat with your healthcare providers</p>
              </div>
            </div>
          </div>

          <div className="chat-patient-content">
            <div className={`chat-sidebar ${isMobileView && !showRoomList ? 'hidden' : ''}`}>
              <ChatRoomList
                onRoomSelect={handleRoomSelect}
                onCreateRoom={handleCreateRoom}
                selectedRoomId={selectedRoom?.id}
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
        </div>
      </div>
    </div>
  );
};

export default ChatPatient;
