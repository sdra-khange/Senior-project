import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosProfile from '../../../../utils/axiosProfile';
import SidebarPatient from '../SidebarPatient';
import Navbar from '../NavBarPatient';
import { FaVideo, FaSignInAlt } from 'react-icons/fa';
import '../../Doctor/Room/Room.css';

const ListRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const response = await axiosProfile.get('/app/api/livekit/rooms/list/');
      if (response.data) {
        console.log('Rooms fetched successfully:', response.data);
        setRooms(response.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setMessage(
          error.response.data.error ||
          error.response.data.detail ||
          'An error occurred while fetching rooms.'
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

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleJoinRoom = async (roomName) => {
    setMessage('');
    setIsLoading(true);
    try {
      const response = await axiosProfile.post('/app/api/livekit/rooms/join/', {
        room_name: roomName
      });

      if (response.data) {
        console.log('Joining room:', response.data);
        setMessage('Joining room...');
        // Navigate to video call page
        setTimeout(() => {
          navigate(`/patient/video-call/${roomName}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setMessage(
          error.response.data.error ||
          error.response.data.detail ||
          'An error occurred while joining the room.'
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
      <SidebarPatient />
      <Navbar />
      <div className="doctor-profile-main-content">
        <div className="profile-container">
          <div className="profile-content-area">
            <div className="room-page-header">
              <FaVideo className="room-page-icon" />
              <h2>Available Video Consultation Rooms</h2>
            </div>
            
            <div className="room-form-container">
              {message && (
                <div className={`room-alert ${message.includes('Joining') ? 'room-alert-success' : 'room-alert-error'}`}>
                  {message}
                </div>
              )}

              {isLoading ? (
                <div className="room-loading-overlay">
                  <div className="room-loading-spinner"></div>
                </div>
              ) : (
                <>
                  {rooms.length > 0 ? (
                    <ul className="room-list">
                      {rooms.map((room) => (
                        <li key={room.room_name} className="room-list-item">
                          <div className="room-list-info">
                            <h3 className="room-list-name">{room.room_name}</h3>
                            <p className="room-list-meta">
                              Created: {new Date(room.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="room-list-actions">
                            <button
                              onClick={() => handleJoinRoom(room.room_name)}
                              className="room-btn room-btn-primary"
                            >
                              <FaSignInAlt className="room-page-icon" />
                              Join
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="room-form-text">No rooms available.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListRooms; 