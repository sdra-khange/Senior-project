import React, { useState, useEffect, useRef } from 'react';
import { FaVideo, FaMicrophone, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import './MediaPermissionChecker.css';

const MediaPermissionChecker = ({ onPermissionsGranted, onError }) => {
  const [permissionStatus, setPermissionStatus] = useState({
    camera: 'unknown', // 'unknown', 'granted', 'denied', 'checking'
    microphone: 'unknown',
    overall: 'unknown'
  });
  const [isChecking, setIsChecking] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [testStream, setTestStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Cleanup stream on unmount
    return () => {
      if (testStream) {
        testStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [testStream]);

  const checkPermissions = async () => {
    setIsChecking(true);
    setPermissionStatus({
      camera: 'checking',
      microphone: 'checking',
      overall: 'checking'
    });

    try {
      console.log("🔍 Checking media permissions...");

      // First, check if browser supports media devices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support camera and microphone access");
      }

      // Try to get permissions step by step
      let cameraGranted = false;
      let microphoneGranted = false;
      let stream = null;

      // Step 1: Try to get microphone permission first
      try {
        console.log("🎤 Requesting microphone permission...");
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphoneGranted = true;
        setPermissionStatus(prev => ({ ...prev, microphone: 'granted' }));
        console.log("✅ Microphone permission granted");
        
        // Stop the audio stream for now
        audioStream.getTracks().forEach(track => track.stop());
      } catch (audioError) {
        console.error("❌ Microphone permission denied:", audioError);
        setPermissionStatus(prev => ({ ...prev, microphone: 'denied' }));
      }

      // Step 2: Try to get camera permission
      try {
        console.log("📹 Requesting camera permission...");
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraGranted = true;
        setPermissionStatus(prev => ({ ...prev, camera: 'granted' }));
        console.log("✅ Camera permission granted");
        
        // Stop the video stream for now
        videoStream.getTracks().forEach(track => track.stop());
      } catch (videoError) {
        console.error("❌ Camera permission denied:", videoError);
        setPermissionStatus(prev => ({ ...prev, camera: 'denied' }));
      }

      // Step 3: If both permissions granted, get combined stream for testing
      if (cameraGranted && microphoneGranted) {
        try {
          console.log("🎯 Getting combined media stream...");
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

          setTestStream(stream);
          
          // Show video preview
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }

          setPermissionStatus(prev => ({ ...prev, overall: 'granted' }));
          console.log("🎉 All permissions granted successfully");
        } catch (combinedError) {
          console.error("❌ Failed to get combined stream:", combinedError);
          throw combinedError;
        }
      } else {
        setPermissionStatus(prev => ({ ...prev, overall: 'denied' }));
        throw new Error("Camera and/or microphone permissions were denied");
      }

      // Get device information
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        
        setDeviceInfo({
          videoCount: videoDevices.length,
          audioCount: audioDevices.length,
          devices: devices
        });
      } catch (enumError) {
        console.warn("Could not enumerate devices:", enumError);
      }

      // Call success callback
      if (onPermissionsGranted && stream) {
        onPermissionsGranted(stream);
      }

    } catch (error) {
      console.error("💥 Permission check failed:", error);
      setPermissionStatus(prev => ({ ...prev, overall: 'denied' }));
      
      if (onError) {
        onError(error.message);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'granted':
        return <FaCheck className="status-icon granted" />;
      case 'denied':
        return <FaTimes className="status-icon denied" />;
      case 'checking':
        return <div className="status-spinner" />;
      default:
        return <FaExclamationTriangle className="status-icon unknown" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'granted':
        return 'Granted';
      case 'denied':
        return 'Denied';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="media-permission-checker">
      <div className="checker-header">
        <h3>📹 Camera & Microphone Setup</h3>
        <p>We need access to your camera and microphone for the video call.</p>
      </div>

      <div className="permission-status">
        <div className="permission-item">
          <FaVideo className="permission-icon" />
          <span className="permission-label">Camera</span>
          {getStatusIcon(permissionStatus.camera)}
          <span className="permission-text">{getStatusText(permissionStatus.camera)}</span>
        </div>

        <div className="permission-item">
          <FaMicrophone className="permission-icon" />
          <span className="permission-label">Microphone</span>
          {getStatusIcon(permissionStatus.microphone)}
          <span className="permission-text">{getStatusText(permissionStatus.microphone)}</span>
        </div>
      </div>

      {deviceInfo && (
        <div className="device-info">
          <p>📊 Devices found: {deviceInfo.videoCount} cameras, {deviceInfo.audioCount} microphones</p>
        </div>
      )}

      {testStream && (
        <div className="video-preview">
          <h4>📹 Camera Preview</h4>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="preview-video"
          />
          <p className="preview-note">You should see yourself in the preview above</p>
        </div>
      )}

      <div className="checker-actions">
        {permissionStatus.overall !== 'granted' && (
          <button
            onClick={checkPermissions}
            disabled={isChecking}
            className="check-permissions-btn"
          >
            {isChecking ? '🔄 Checking...' : '🔑 Check Permissions'}
          </button>
        )}

        {permissionStatus.overall === 'granted' && (
          <div className="success-message">
            <FaCheck className="success-icon" />
            <span>All permissions granted! You're ready to join the video call.</span>
          </div>
        )}

        {permissionStatus.overall === 'denied' && (
          <div className="error-message">
            <FaTimes className="error-icon" />
            <span>Permissions denied. Please allow camera and microphone access.</span>
          </div>
        )}
      </div>

      {permissionStatus.overall === 'denied' && (
        <div className="troubleshooting">
          <h4>🛠️ Troubleshooting</h4>
          <ul>
            <li>Look for a camera/microphone icon in your browser's address bar</li>
            <li>Click on it and select "Allow" for this site</li>
            <li>If you don't see the icon, check your browser settings</li>
            <li>Make sure no other application is using your camera/microphone</li>
            <li>Try refreshing the page and clicking "Check Permissions" again</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MediaPermissionChecker;
