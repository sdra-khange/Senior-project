import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosProfile from '../../../../utils/axiosProfile';
import SidebarDoctor from '../SidebarDoctor';
import Navbar from '../NavBardoctor';
import { FaVideo, FaTrash, FaSignInAlt } from 'react-icons/fa';
import './Room.css';

const ListRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    show: false,
    roomName: null
  });

  const fetchRooms = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axiosProfile.get('/app/api/livekit/rooms/list/');
      setRooms(response.data);
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

  const handleDeleteClick = (roomName) => {
    setDeleteDialog({
      show: true,
      roomName
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axiosProfile.delete(`/app/api/livekit/rooms/${deleteDialog.roomName}/`);
      if (response.status === 200) {
        setMessage('Room deleted successfully');
        setRooms(rooms.filter(room => room.room_name !== deleteDialog.roomName));
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      setMessage(error.response?.data?.error || 'Failed to delete room');
    } finally {
      setDeleteDialog({ show: false, roomName: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ show: false, roomName: null });
  };

  const handleJoinRoom = (roomName) => {
    navigate(`/doctor/room/call/${encodeURIComponent(roomName)}`);
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
              <h2>Manage LiveKit Rooms</h2>
            </div>
            
            <div className="room-form-container">
              {message && (
                <div className={`room-alert ${message.includes('success') ? 'room-alert-success' : 'room-alert-error'}`}>
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
                            <button
                              onClick={() => handleDeleteClick(room.room_name)}
                              className="room-btn-icon room-btn-icon-delete"
                              title="Delete Room"
                            >
                              <FaTrash />
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

      {/* Delete Confirmation Dialog */}
      {deleteDialog.show && (
        <>
          <div className="room-confirm-dialog-overlay" onClick={handleDeleteCancel} />
          <div className="room-confirm-dialog">
            <h3 className="room-confirm-dialog-title">Delete Room</h3>
            <p className="room-confirm-dialog-message">
              Are you sure you want to delete the room "{deleteDialog.roomName}"? This action cannot be undone.
            </p>
            <div className="room-confirm-dialog-actions">
              <button
                className="room-confirm-dialog-btn room-confirm-dialog-btn-cancel"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button
                className="room-confirm-dialog-btn room-confirm-dialog-btn-confirm"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListRooms; 