import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosProfile from '../../../../utils/axiosProfile';
import SidebarDoctor from '../SidebarDoctor';
import Navbar from '../NavBardoctor';
import { FaVideo } from 'react-icons/fa';
import './Room.css';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setMessage('Please enter a room name');
      return;
    }

    setMessage('');
    setIsLoading(true);
    try {
      const response = await axiosProfile.post('/app/api/livekit/rooms/', {
        room_name: roomName.trim()
      });

      if (response.data) {
        console.log('Room created successfully:', response.data);
        setMessage('Room created successfully!');
        setRoomName('');
        // Navigate to room list after successful creation
        setTimeout(() => {
          navigate('/doctor/room/list');
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setMessage(
          error.response.data.error ||
          error.response.data.detail ||
          'An error occurred while creating the room. Please try again.'
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
              <h2>Create Video Consultation Room</h2>
            </div>
            
            <div className="room-form-container">
              <form onSubmit={handleCreateRoom} className="room-form">
                <div className="room-form-group">
                  <label htmlFor="roomName" className="room-form-label">Room Name</label>
                  <input
                    id="roomName"
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter a name for your consultation room"
                    required
                    disabled={isLoading}
                    className="room-form-input"
                  />
                  <small className="room-form-text">
                    Choose a descriptive name for your video consultation room
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
                        Creating Room...
                      </>
                    ) : (
                      'Create Room'
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

export default CreateRoom; 