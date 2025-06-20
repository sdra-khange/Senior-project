import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosProfile from '../../../../utils/axiosProfile';
import SidebarDoctor from '../SidebarDoctor';
import Navbar from '../NavBardoctor';
import { FaVideo, FaSignInAlt } from 'react-icons/fa';
import './Room.css';

const JoinRoom = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setMessage('Please enter a room name');
      return;
    }

    setMessage('');
    setIsLoading(true);
    try {
      const response = await axiosProfile.post('/app/api/livekit/rooms/join/', {
        room_name: roomName.trim()
      });

      if (response.data) {
        console.log('Joining room:', response.data);
        setMessage('Joining room...');
        // Navigate to the video call page with the room name
        navigate(`/doctor/room/call/${encodeURIComponent(roomName.trim())}`);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setMessage(
          error.response.data.error ||
          error.response.data.detail ||
          'An error occurred while joining the room. Please check the room name and try again.'
        );
      } else if (error.request) {
        console.error('No response received:', error.request);
        setMessage('No response from server. Please check your internet connection.');
      } else {
        console.error('Error setting up request:', error.message);
        setMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="doctor-profile-page">
      <SidebarDoctor />
      <Navbar />
      <div className="doctor-profile-main-content">
        <div className="profile-container">
          <div className="profile-content-area">
            <div className="room-page-header">
              <FaVideo className="room-page-icon" />
              <h2>Join Video Consultation Room</h2>
            </div>

            <div className="room-form-container">
              <form onSubmit={handleJoinRoom} className="room-join-form">
                <div className="room-form-group">
                  <label htmlFor="roomName" className="room-form-label">Room Name</label>
                  <input
                    id="roomName"
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter the room name to join"
                    required
                    disabled={isLoading}
                    className="room-form-input room-code-input"
                  />
                  <small className="room-form-text">
                    Enter the name of the room you want to join
                  </small>
                </div>

                {message && (
                  <div className={`room-alert ${message.includes('success') ? 'room-alert-success' : 'room-alert-error'}`}>
                    {message}
                  </div>
                )}

                <div className="room-form-actions">
                  <button 
                    type="submit" 
                    className="room-btn room-btn-primary" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="room-spinner"></span>
                        Joining Room...
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="room-page-icon" />
                        Join Room
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom; 