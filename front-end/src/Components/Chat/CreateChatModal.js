import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaUsers, FaSearch, FaSpinner } from 'react-icons/fa';
import axiosTherapy from '../../utils/axiosTherapy';
import './CreateChatModal.css';

const CreateChatModal = ({ onClose, onRoomCreated, userType, currentUser }) => {
  const [chatType, setChatType] = useState('individual');
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await axiosTherapy.get('/patient/');
      setPatients(response.data);
    } catch (error) {
      console.error('Error loading patients:', error);
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.first_name && patient.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (patient.last_name && patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePatientSelect = (patient) => {
    if (chatType === 'individual') {
      setSelectedPatients([patient]);
    } else {
      setSelectedPatients(prev => {
        const isSelected = prev.some(p => p.id === patient.id);
        if (isSelected) {
          return prev.filter(p => p.id !== patient.id);
        }
        return [...prev, patient];
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      let roomData = {
        room_type: chatType,
        participant_ids: []
      };

      if (chatType === 'group') {
        roomData.participant_ids = selectedPatients.map(patient => patient.id);
        roomData.name = roomName;
        if (description) {
          roomData.description = description;
        }
      } else {
        roomData.participant_ids = [selectedPatients[0].id];
        roomData.name = `Chat with ${selectedPatients[0].username}`;
      }

      console.log('Sending room data:', roomData);

      const newRoom = await axiosTherapy.post('/chat/rooms/', roomData);
      onRoomCreated(newRoom.data);
      onClose();
    } catch (error) {
      console.error('Error creating chat room:', error.response?.data || error);
      setError(error.response?.data?.errors?.[0] || 'Failed to create chat room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (chatType === 'individual') {
      if (selectedPatients.length !== 1) {
        setError('Individual chat must have exactly 1 patient');
        return false;
      }
    } else {
      if (selectedPatients.length < 1) {
        setError('Group chat must have at least 1 patient');
        return false;
      }
    }

    if (chatType === 'group' && !roomName.trim()) {
      setError('Please enter a room name for group chat');
      return false;
    }

    return true;
  };

  return (
    <div className="modal-overlay">
      <div className="create-chat-modal">
        <div className="modal-header">
          <h2>Create New Chat</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          <div className="chat-type-selector">
            <button
              className={`type-button ${chatType === 'individual' ? 'active' : ''}`}
              onClick={() => setChatType('individual')}
            >
              <FaUser />
              Individual Chat
            </button>
            <button
              className={`type-button ${chatType === 'group' ? 'active' : ''}`}
              onClick={() => setChatType('group')}
            >
              <FaUsers />
              Group Chat
            </button>
          </div>

          {chatType === 'group' && (
            <div className="group-settings">
              <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="room-name-input"
              />
              <textarea
                placeholder="Room Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="room-description-input"
              />
            </div>
          )}

          <div className="participant-search">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="selected-participants">
            {selectedPatients.map(patient => (
              <div key={patient.id} className="selected-user">
                <span>{patient.username}</span>
                <button
                  onClick={() => handlePatientSelect(patient)}
                  className="remove-user"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>

          <div className="users-list">
            {loading ? (
              <div className="loading-users">
                <FaSpinner className="spinner" />
                <span>Loading patients...</span>
              </div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              filteredPatients.map(patient => (
                <div
                  key={patient.id}
                  className={`user-item ${selectedPatients.some(p => p.id === patient.id) ? 'selected' : ''}`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <div className="user-info">
                    <span className="username">
                      {patient.first_name && patient.last_name 
                        ? `${patient.first_name} ${patient.last_name}`
                        : patient.username}
                    </span>
                    <span className="user-type">Patient</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="create-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" />
                Creating...
              </>
            ) : (
              'Create Chat'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChatModal;
