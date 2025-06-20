import React from 'react';
import { 
  useLocalParticipant, 
  useRemoteParticipants 
} from '@livekit/components-react';
import { FaUsers, FaTimes, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { getUserInfo } from '../../utils/cookieUtils';
import './ParticipantList.css';

const ParticipantList = ({ isOpen, onToggle }) => {
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const user = getUserInfo();

  const getParticipantInfo = (participant, isLocal = false) => {
    let name, role, userType;
    
    if (isLocal) {
      name = user.username || user.email || 'You';
      userType = user.user_type || '';
      role = userType === 'doctor' ? '👨‍⚕️ Doctor' : userType === 'patient' ? '👤 Patient' : '👥 User';
    } else {
      name = participant?.name || participant?.identity || 'Unknown';
      
      // Try to get role from metadata
      try {
        const metadata = participant?.metadata ? JSON.parse(participant.metadata) : {};
        userType = metadata.user_type || '';
        role = userType === 'doctor' ? '👨‍⚕️ Doctor' : userType === 'patient' ? '👤 Patient' : '👥 User';
      } catch {
        role = '👥 User';
      }
    }

    return { name, role, userType };
  };

  const getConnectionQuality = (participant) => {
    // This would typically come from LiveKit's connection quality API
    // For now, we'll show a simple indicator
    return 'good'; // 'excellent', 'good', 'poor'
  };

  const getQualityIcon = (quality) => {
    switch (quality) {
      case 'excellent':
        return '🟢';
      case 'good':
        return '🟡';
      case 'poor':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const allParticipants = [
    { participant: localParticipant, isLocal: true },
    ...remoteParticipants.map(p => ({ participant: p, isLocal: false }))
  ];

  if (!isOpen) {
    return (
      <button 
        className="participant-list-toggle"
        onClick={onToggle}
        title="Show Participants"
      >
        <FaUsers />
        <span className="participant-count-badge">
          {allParticipants.length}
        </span>
      </button>
    );
  }

  return (
    <div className="participant-list-panel">
      <div className="participant-list-header">
        <div className="participant-list-title">
          <FaUsers className="participant-icon" />
          <span>Participants ({allParticipants.length})</span>
        </div>
        <button 
          className="participant-list-close"
          onClick={onToggle}
          title="Close Participants"
        >
          <FaTimes />
        </button>
      </div>

      <div className="participant-list-content">
        {allParticipants.map(({ participant, isLocal }, index) => {
          const { name, role } = getParticipantInfo(participant, isLocal);
          const quality = getConnectionQuality(participant);
          
          return (
            <div key={index} className={`participant-item ${isLocal ? 'local-participant' : ''}`}>
              <div className="participant-avatar">
                <div className="avatar-circle">
                  {role.split(' ')[0]}
                </div>
                <div className="connection-quality">
                  {getQualityIcon(quality)}
                </div>
              </div>
              
              <div className="participant-info">
                <div className="participant-name">
                  {name} {isLocal && '(You)'}
                </div>
                <div className="participant-role">
                  {role}
                </div>
              </div>
              
              <div className="participant-controls">
                <div className="media-status">
                  {participant?.isMicrophoneEnabled ? (
                    <FaMicrophone className="media-icon enabled" title="Microphone On" />
                  ) : (
                    <FaMicrophoneSlash className="media-icon disabled" title="Microphone Off" />
                  )}
                  
                  {participant?.isCameraEnabled ? (
                    <FaVideo className="media-icon enabled" title="Camera On" />
                  ) : (
                    <FaVideoSlash className="media-icon disabled" title="Camera Off" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {allParticipants.length === 1 && (
          <div className="waiting-message">
            <div className="waiting-icon">⏳</div>
            <p>Waiting for others to join...</p>
            <p className="waiting-subtitle">
              Share the room name with participants
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantList;
