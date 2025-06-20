import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  LiveKitRoom,
  VideoConference,
  ControlBar,
  RoomAudioRenderer
} from "@livekit/components-react";
import '@livekit/components-styles';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import ChatPanel from './ChatPanel';
import ParticipantList from './ParticipantList';
import MediaPermissionChecker from './MediaPermissionChecker';
import { getUserInfo, getAuthToken } from '../../utils/cookieUtils';
import '../ErrorBoundary/ErrorBoundary.css';
import './LiveKitRoom.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/app/api";

function LiveKitRoomComponent({ roomName }) {
  const navigate = useNavigate();
  const mediaStreamRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const [token, setToken] = useState(null);
  const [wsUrl, setWsUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);
  const [showPermissionChecker, setShowPermissionChecker] = useState(false);

  // Memoize LiveKit options to prevent unnecessary re-renders
  const liveKitOptions = useMemo(() => ({
    adaptiveStream: true,
    dynacast: true,
    publishDefaults: {
      simulcast: true,
      videoSimulcastLayers: [
        { width: 320, height: 180, encoding: { maxBitrate: 150000, maxFramerate: 15 } },
        { width: 640, height: 360, encoding: { maxBitrate: 500000, maxFramerate: 30 } },
        { width: 1280, height: 720, encoding: { maxBitrate: 1500000, maxFramerate: 30 } },
      ],
    },
    connectOptions: {
      autoSubscribe: true,
      maxRetries: 3,
      retryDelayMs: 2000,
      rtcConfig: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ],
        iceCandidatePoolSize: 10,
      },
    },
  }), []);

  const initializeMedia = useCallback(async () => {
    try {
      console.log("🎥 Starting media initialization...");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support camera and microphone access");
      }

      // First, try to enumerate devices (this might require permission)
      let devices = [];
      try {
        devices = await navigator.mediaDevices.enumerateDevices();
      } catch (enumError) {
        console.warn("Could not enumerate devices initially:", enumError);
        // Continue anyway, we'll try to get permissions first
      }

      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');

      console.log(`📹 Found ${videoDevices.length} video devices, ${audioDevices.length} audio devices`);

      // Clean up existing stream if any
      if (mediaStreamRef.current) {
        console.log("Cleaning up existing media stream");
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }

      // Try different permission strategies
      let stream = null;

      // Strategy 1: Request both video and audio
      try {
        console.log(" Attempting to get video + audio permissions...");
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            facingMode: "user"
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        console.log(" Successfully got video + audio stream");
      } catch (bothError) {
        console.warn(" Failed to get both video and audio:", bothError);

        // Strategy 2: Try audio only first, then video
        try {
          console.log("Attempting audio-only permissions...");
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });

          console.log(" Now attempting video permissions...");
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280, min: 640 },
              height: { ideal: 720, min: 480 },
              facingMode: "user"
            }
          });

          // Combine streams
          const combinedStream = new MediaStream([
            ...audioStream.getTracks(),
            ...videoStream.getTracks()
          ]);

          // Clean up individual streams
          audioStream.getTracks().forEach(track => track.stop());
          videoStream.getTracks().forEach(track => track.stop());

          stream = combinedStream;
          console.log(" Successfully combined audio + video streams");
        } catch (separateError) {
          console.error(" Failed to get media permissions:", separateError);
          throw new Error(`Camera and microphone access denied. Please allow permissions and try again. Error: ${separateError.message}`);
        }
      }

      // Re-enumerate devices after getting permissions
      try {
        devices = await navigator.mediaDevices.enumerateDevices();
        const updatedVideoDevices = devices.filter(device => device.kind === 'videoinput');
        const updatedAudioDevices = devices.filter(device => device.kind === 'audioinput');

        setDeviceInfo({
          hasVideo: updatedVideoDevices.length > 0,
          hasAudio: updatedAudioDevices.length > 0,
          videoCount: updatedVideoDevices.length,
          audioCount: updatedAudioDevices.length
        });

        console.log(`📊 Final device count: ${updatedVideoDevices.length} video, ${updatedAudioDevices.length} audio`);
      } catch (enumError) {
        console.warn("Could not re-enumerate devices:", enumError);
      }

      // Store stream reference for cleanup
      mediaStreamRef.current = stream;
      console.log("🎉 Media initialization completed successfully");
      return stream;
    } catch (err) {
      console.error("💥 Media initialization error:", err);
      setError(err.message);
      return null;
    }
  }, []);

  const fetchToken = useCallback(async () => {
    const userToken = getAuthToken();
    if (!userToken) {
      setError("No authentication token found. Please log in again.");
      return;
    }

    try {
      console.log("Fetching token for room:", roomName);

      // Get user data to extract participant name
      const user = getUserInfo();
      const participantName = user.username || user.email || "user";

      const response = await fetch(`${API_BASE_URL}/livekit/rooms/join/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          room_name: roomName,
          participant_name: participantName,
          metadata: JSON.stringify({
            user_type: "participant",
            room_type: "consultation",
            user_id: user?.id || null
          })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server response:", errorData);

        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        } else if (response.status === 404) {
          throw new Error("Room not found. Please check the room name.");
        } else if (response.status === 403) {
          throw new Error("Access denied. You don't have permission to join this room.");
        } else {
          throw new Error(errorData.message || errorData.detail || `Server error: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log("Received token data:", {
        hasToken: !!data.token,
        hasWsUrl: !!data.ws_url,
        wsUrl: data.ws_url,
        roomName: roomName
      });

      if (!data.token) {
        throw new Error("No access token received from server");
      }

      if (!data.ws_url) {
        throw new Error("No WebSocket URL received from server");
      }

      setToken(data.token);
      setWsUrl(data.ws_url);
    } catch (error) {
      console.error("Token fetch error:", error);
      setError(error.message);
    }
  }, [roomName]);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      try {
        const mediaStream = await initializeMedia();
        if (!mediaStream || !isMounted) return;

        await fetchToken();
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;

      // Clear any pending reconnection timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Cleanup media stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }

      // Reset state
      setToken(null);
      setWsUrl(null);
      setConnectionStatus('disconnected');
      setReconnecting(false);
      setReconnectAttempts(0);
    };
  }, [initializeMedia, fetchToken]);

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const mediaStream = await initializeMedia();
      if (!mediaStream) return;
      await fetchToken();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  const toggleParticipantList = useCallback(() => {
    setIsParticipantListOpen(prev => !prev);
  }, []);

  const handlePermissionsGranted = useCallback((stream) => {
    console.log("✅ Permissions granted via checker, proceeding with connection");
    mediaStreamRef.current = stream;
    setShowPermissionChecker(false);
    fetchToken();
  }, [fetchToken]);

  const handlePermissionError = useCallback((errorMessage) => {
    console.error("❌ Permission checker error:", errorMessage);
    setError(errorMessage);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-box">
          <div className="loading-spinner"></div>
          <p>Initializing video call...</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
            {reconnecting ? 'Reconnecting to room...' : 'Setting up your camera and microphone'}
          </p>
          {deviceInfo && (
            <div className="device-info">
              <h4>Device Status</h4>
              <p>📹 Camera: {deviceInfo.hasVideo ? '✅ Ready' : '❌ Not found'} ({deviceInfo.videoCount} devices)</p>
              <p>🎤 Microphone: {deviceInfo.hasAudio ? '✅ Ready' : '❌ Not found'} ({deviceInfo.audioCount} devices)</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">⚠ {error}</p>
        {deviceInfo && (
          <div className="device-status">
            <p>Device Status:</p>
            <p>Cameras found: {deviceInfo.videoCount}</p>
            <p>Microphones found: {deviceInfo.audioCount}</p>
          </div>
        )}
        <div className="troubleshooting-steps">
          <h4>💡 Troubleshooting Steps</h4>
          <ol>
            <li>🔌 Try disabling your VPN if it's enabled</li>
            <li>🔑 Click the "Request Permissions" button below</li>
            <li>✅ When prompted, allow camera and microphone access</li>
            <li>⚙️ If no prompt appears, check browser settings:
              <ul>
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Site Settings → Camera/Microphone</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Permissions → Camera/Microphone</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Camera/Microphone</li>
              </ul>
            </li>
            <li>🔄 Refresh the page and try again</li>
          </ol>
        </div>
        <div className="button-container">
          <button onClick={handleRetry} className="primary-button">
            Request Permissions
          </button>
          <button
            onClick={() => setShowPermissionChecker(true)}
            className="secondary-button"
          >
            🔧 Advanced Setup
          </button>
          <button onClick={() => navigate(0)} className="tertiary-button">
            Refresh Page
          </button>
        </div>

        {showPermissionChecker && (
          <div className="permission-checker-overlay">
            <MediaPermissionChecker
              onPermissionsGranted={handlePermissionsGranted}
              onError={handlePermissionError}
            />
            <button
              onClick={() => setShowPermissionChecker(false)}
              className="close-checker-button"
            >
              ✕ Close
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!token || !wsUrl) {
    return (
      <div className="error-container">
        <p className="error-message">⚠ Error fetching connection details. Please try again.</p>
        <div className="button-container">
          <button onClick={handleRetry} className="primary-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <LiveKitRoom
        token={token}
        serverUrl={wsUrl}
        connect={true}
      onConnected={() => {
        console.log("Connected to LiveKit room");
        setConnectionStatus('connected');
        setReconnecting(false);
      }}
      onDisconnected={(reason) => {
        console.log("Disconnected from LiveKit room:", reason);
        setConnectionStatus('disconnected');
        setReconnecting(false);

        if (reason === 'ROOM_DELETED') {
          setError("Room has been closed by the host");
        } else if (reason === 'PARTICIPANT_REMOVED') {
          setError("You have been removed from the room");
        } else if (reason === 'SIGNAL_CLOSE' || reason === 'UNKNOWN') {
          // Attempt automatic reconnection for network issues
          if (reconnectAttempts < 3) {
            setReconnectAttempts(prev => prev + 1);
            reconnectTimeoutRef.current = setTimeout(() => {
              setReconnecting(true);
              // The LiveKit room will automatically attempt to reconnect
            }, 2000 * (reconnectAttempts + 1)); // Exponential backoff
          } else {
            setError("Connection lost. Please refresh the page to reconnect.");
          }
        }
      }}

      onError={(error) => {
        console.error("LiveKit Room Error:", error);
        setConnectionStatus('error');
        setReconnecting(false);

        if (error.message.includes("permissions denied") || error.message.includes("401")) {
          setError("Authentication failed. The room token is invalid or expired. Please try refreshing the page.");
        } else if (error.message.includes("token")) {
          setError("Token validation failed. Please try joining the room again.");
        } else if (error.message.includes("signal connection")) {
          setError("Failed to connect to the video server. Please check your internet connection and try again.");
        } else if (error.message.includes("room not found")) {
          setError("The room you're trying to join doesn't exist. Please check the room name.");
        } else {
          setError(`Connection error: ${error.message}`);
        }
      }}
      options={liveKitOptions}
    >
      <div className="livekit-container">
        {connectionStatus === 'connected' && (
          <div className="connection-status connected">
            🟢 Connected to: {roomName}
          </div>
        )}
        {reconnecting && (
          <div className="connection-status reconnecting">
            🔄 Reconnecting... (Attempt {reconnectAttempts + 1}/3)
          </div>
        )}
        <VideoConference className="video-conference" />
        <RoomAudioRenderer />
        <ControlBar
          controls={{
            camera: true,
            microphone: true,
            screenShare: true,
            leave: true
          }}
          className="control-bar"
        />

        {/* Chat Panel */}
        <ChatPanel
          isOpen={isChatOpen}
          onToggle={toggleChat}
        />

        {/* Participant List */}
        <ParticipantList
          isOpen={isParticipantListOpen}
          onToggle={toggleParticipantList}
        />
      </div>
    </LiveKitRoom>
    </ErrorBoundary>
  );
}

export default LiveKitRoomComponent;
