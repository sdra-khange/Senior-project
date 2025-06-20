import React, { useEffect, useState } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  ConnectionStateToast,
  RoomName,
  ParticipantCount,
} from '@livekit/components-react';
import '@livekit/components-styles';
import axios from '../utils/axiosProfile';
import { useParams, useNavigate } from 'react-router-dom';
import Cookie from 'cookie-universal';
import { FaTimes, FaUsers, FaClock, FaSignal } from 'react-icons/fa';
import './LiveKitRoom.css';

const LiveKitRoomComponent = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const cookies = Cookie();
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [sessionStartTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchSessionAndToken = async () => {
      try {
        // Get user data from cookies
        const userData = cookies.get('user-data');
        if (!userData) {
          throw new Error('User not authenticated');
        }

        // Fetch session details
        const sessionResponse = await axios.get(`/app/sessions/${sessionId}/`);
        setSessionDetails(sessionResponse.data);

        // Check if user is authorized to join this session
        if (userData.user_type === 'doctor' && sessionResponse.data.doctor !== userData.id) {
          throw new Error('Unauthorized access');
        }
        if (userData.user_type === 'patient' && sessionResponse.data.patient !== userData.id) {
          throw new Error('Unauthorized access');
        }

        // Get LiveKit token
        const tokenResponse = await axios.post('/app/livekit/token/', {
          room_name: `session-${sessionId}`,
          participant_name: userData.user_type === 'doctor' 
            ? `Dr. ${userData.username}`
            : userData.username,
        });

        setToken(tokenResponse.data.token);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to join session');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionAndToken();
  }, [sessionId, cookies]);

  // Timer effect for session duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getSessionDuration = () => {
    const duration = Math.floor((currentTime - sessionStartTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLeaveSession = () => {
    navigate(-1); // Go back to previous page
  };

  if (isLoading) {
    return (
      <div className="livekit-loading">
        <div className="spinner"></div>
        <p>Connecting to session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="livekit-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={handleLeaveSession} className="leave-btn">
          Go Back
        </button>
      </div>
    );
  }

  if (!token || !sessionDetails) {
    return (
      <div className="livekit-error">
        <h3>Session Not Found</h3>
        <p>Unable to join the session. Please try again later.</p>
        <button onClick={handleLeaveSession} className="leave-btn">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="livekit-container">
      <div className="livekit-header">
        <div className="session-info">
          <h2>
            {sessionDetails.session_type === 'VIDEO' ? 'Video Session' :
             sessionDetails.session_type === 'VOICE' ? 'Voice Call' : 'Messaging'}
          </h2>
          <div className="session-stats">
            <div className="stat-item">
              <FaClock />
              <span>{getSessionDuration()}</span>
            </div>
            <div className="stat-item">
              <FaSignal />
              <span className={`connection-status ${connectionStatus}`}>
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
        <button onClick={handleLeaveSession} className="leave-btn">
          <FaTimes /> Leave Session
        </button>
      </div>
      
      <LiveKitRoom
        token={token}
        serverUrl={process.env.REACT_APP_LIVEKIT_URL}
        connect={true}
        video={sessionDetails.session_type === 'VIDEO'}
        audio={sessionDetails.session_type === 'VIDEO' || sessionDetails.session_type === 'VOICE'}
        onConnected={() => setConnectionStatus('connected')}
        onDisconnected={() => setConnectionStatus('disconnected')}
        onReconnecting={() => setConnectionStatus('connecting')}
      >
        <div className="livekit-content">
          <ConnectionStateToast />
          <VideoConference />
          <RoomAudioRenderer />
          <ControlBar />
        </div>
      </LiveKitRoom>
    </div>
  );
};

export default LiveKitRoomComponent; 