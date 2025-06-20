import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosProfile from "../../../../utils/axiosProfile";
import './ProfileDoctor.css';
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';
import Cookie from 'cookie-universal';
import { FaUser, FaEdit, FaKey, FaCamera } from 'react-icons/fa';

const cookie = Cookie();

const ProfileDoctor = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [specialization, setSpecialization] = useState('');
    const [age, setAge] = useState('');
    const [sessionPrice, setSessionPrice] = useState('');
    const [experienceYears, setExperienceYears] = useState('');
    const [sessionDuration, setSessionDuration] = useState(30);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('information');

    // Check for authentication token on component mount
    useEffect(() => {
        const token = cookie.get("auth-token");
        if (!token) {
            navigate('/doctor/login');
        }
    }, [navigate]);

    // Fetch basic user information
    const fetchDoctorInfo = useCallback(async () => {
        try {
            // Try to get user data from cookie first
            const userData = cookie.get("user-data");
            if (userData) {
                try {
                    let user = null;
                    if (typeof userData === 'string') {
                        user = JSON.parse(userData);
                    } else if (typeof userData === 'object') {
                        user = userData;
                    }

                    if (user) {
                        setUsername(user.username || user.email || '');

                        if (user.profile_photo) {
                            setProfilePhoto(`http://127.0.0.1:8000${user.profile_photo}`);
                        }
                        return;
                    }
                } catch (parseError) {
                    console.warn("Failed to parse user data from cookie:", parseError);
                }
            }

            // Fallback to API call if no cookie data
            const response = await axiosProfile.get('/auth/user/');
            const data = response.data.data || response.data;
            setUsername(data.username);

            if (data.profile_photo) {
                setProfilePhoto(`http://127.0.0.1:8000${data.profile_photo}`);
            }
        } catch (error) {
            console.error("Error fetching user info:", error);

            // If API fails, try to get basic info from cookie
            const userData = cookie.get("user-data");
            if (userData) {
                try {
                    let user = null;
                    if (typeof userData === 'string') {
                        user = JSON.parse(userData);
                    } else if (typeof userData === 'object') {
                        user = userData;
                    }

                    if (user) {
                        setUsername(user.username || user.email || '');
                    }
                } catch (parseError) {
                    console.warn("Failed to parse user data from cookie in error handler:", parseError);
                }
            }

            if (error.response?.status === 401) {
                navigate('/doctor/login');
            }
        }
    }, [navigate]);

    // Fetch doctor profile information
    const fetchDoctorProfile = useCallback(async () => {
        try {
            const response = await axiosProfile.get('/auth/profile/');
            const data = response.data;
            
            setSpecialization(data.specialization || '');
            setAge(data.age || '');
            setSessionPrice(data.session_price || '');
            setExperienceYears(data.experience_years || '');
            setSessionDuration(data.session_duration || 30);

            // Only update profile photo if it's not already set and a new one exists
            if (data.profile_picture && !profilePhoto) {
                setProfilePhoto(`http://127.0.0.1:8000${data.profile_picture}`);
            }
        } catch (error) {
            console.error("Error fetching doctor profile:", error);
        }
    }, [profilePhoto]);

    // Fetch data on component mount
    useEffect(() => {
        fetchDoctorInfo();
        fetchDoctorProfile();
    }, [fetchDoctorInfo, fetchDoctorProfile]);

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Only set the file if it's valid
            if (file.type.startsWith('image/')) {
                setProfilePhoto(file);
            } else {
                setProfileMessage('Please select a valid image file');
            }
        }
    };

    // Helper function to get the image source URL
    const getImageSrc = () => {
        if (!profilePhoto) return null;
        
        if (typeof profilePhoto === 'string') {
            // If it's a string, it's already a URL
            return profilePhoto;
        } else if (profilePhoto instanceof File || profilePhoto instanceof Blob) {
            // If it's a File or Blob, create object URL
            return URL.createObjectURL(profilePhoto);
        }
        return null;
    };

    // Update doctor profile
    const updateProfile = async (e) => {
        e.preventDefault();
        setProfileMessage('');
        setIsLoading(true);

        try {
            const userData = new FormData();
            userData.append('username', username);
            
            // Only append profile photo if it's a File (new upload)
            if (profilePhoto && typeof profilePhoto !== 'string') {
                userData.append('profile_photo', profilePhoto);
            }

            // Update basic account info
            await axiosProfile.patch('/auth/account-info', userData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Prepare profile data
            const formData = new FormData();
            formData.append('specialization', specialization);
            formData.append('age', age);
            formData.append('session_price', sessionPrice);
            formData.append('experience_years', experienceYears);
            formData.append('session_duration', sessionDuration);

            // Append profile picture if it's a new file
            if (profilePhoto && typeof profilePhoto !== 'string') {
                formData.append('profile_picture', profilePhoto);
            }

            // Try to create or update profile
            try {
                await axiosProfile.post('/auth/profile/create/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setProfileMessage('Your profile has been created successfully.');
            } catch (createError) {
                await axiosProfile.put('/auth/profile/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setProfileMessage('Your profile has been updated successfully.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setProfileMessage(
                error.response?.data?.message || 
                error.response?.data?.detail || 
                'An error occurred while updating the profile.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Change password function
    const changePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage('');
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            setPasswordMessage('New password and confirm password do not match.');
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setPasswordMessage('New password must be at least 8 characters long.');
            setIsLoading(false);
            return;
        }

        try {
            await axiosProfile.put('/auth/password', {
                old_password: oldPassword,
                new_password: newPassword
            });
            setPasswordMessage('Password changed successfully.');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordMessage(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                'An error occurred while changing the password.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Render the active tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'information':
                return (
                    <div className="tab-content">
                        <h3><FaUser className="tab-icon" /> Personal Information</h3>
                        <div className="info-grid">
                            <div className="info-item"><strong>Full Name:</strong> <p>{username}</p></div>
                            <div className="info-item"><strong>Specialization:</strong> <p>{specialization || 'N/A'}</p></div>
                            <div className="info-item"><strong>Age:</strong> <p>{age || 'N/A'}</p></div>
                            <div className="info-item"><strong>Experience (Years):</strong> <p>{experienceYears || 'N/A'}</p></div>
                            <div className="info-item"><strong>Session Price ($):</strong> <p>{sessionPrice || 'N/A'}</p></div>
                            <div className="info-item"><strong>Session Duration (Minutes):</strong> <p>{sessionDuration || 'N/A'}</p></div>
                        </div>
                    </div>
                );
            case 'edit-profile':
                return (
                    <div className="tab-content">
                        <h3><FaEdit className="tab-icon" /> Edit Profile Information</h3>
                        <form onSubmit={updateProfile} className="profile-edit-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Specialization</label>
                                    <input
                                        type="text"
                                        placeholder="Specialization"
                                        value={specialization}
                                        onChange={(e) => setSpecialization(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        placeholder="Age"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Experience (Years)</label>
                                    <input
                                        type="number"
                                        placeholder="Experience Years"
                                        value={experienceYears}
                                        onChange={(e) => setExperienceYears(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Session Price ($)</label>
                                    <input
                                        type="number"
                                        placeholder="Session Price"
                                        value={sessionPrice}
                                        onChange={(e) => setSessionPrice(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Session Duration (Minutes)</label>
                                    <input
                                        type="number"
                                        placeholder="Session Duration"
                                        value={sessionDuration}
                                        onChange={(e) => setSessionDuration(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {profileMessage && (
                                <p className={`message ${profileMessage.includes('successfully') ? 'success' : 'error'}`}>
                                    {profileMessage}
                                </p>
                            )}

                            <div className="form-actions">
                                <button type="submit" className="save-button" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                        <div className="profile-photo-section">
                            <h4><FaCamera className="section-icon" /> Change Profile Photo</h4>
                            <div className="profile-photo-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="profilePhotoUpload"
                                    onChange={handleFileChange}
                                    disabled={isLoading}
                                />
                                <label htmlFor="profilePhotoUpload" className="profile-photo-upload-label">
                                    {getImageSrc() ? (
                                        <img 
                                            src={getImageSrc()}
                                            alt="Profile" 
                                            className="profile-image-preview" 
                                        />
                                    ) : (
                                        <div className="profile-photo-placeholder">
                                            <FaCamera className="upload-icon" />
                                            <span>Click to upload photo</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 'change-password':
                return (
                    <div className="tab-content">
                        <h3><FaKey className="tab-icon" /> Change Password</h3>
                        <form onSubmit={changePassword} className="password-change-form">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter current password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            {passwordMessage && (
                                <p className={`message ${passwordMessage.includes('successfully') ? 'success' : 'error'}`}>
                                    {passwordMessage}
                                </p>
                            )}
                            <div className="form-actions">
                                <button type="submit" className="save-button" disabled={isLoading}>
                                    {isLoading ? 'Changing...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="doctor-profile-page">
            <SidebarDoctor />
            <Navbar />
            <div className="doctor-profile-main-content">
                <div className="profile-container">
                    <div className="profile-sidebar">
                        <div className="profile-picture-area">
                            <input
                                type="file"
                                accept="image/*"
                                id="profilePhotoUpload"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                disabled={isLoading}
                            />
                            <label htmlFor="profilePhotoUpload" className="profile-photo-upload-label">
                                {getImageSrc() ? (
                                    <img 
                                        src={getImageSrc()}
                                        alt="Profile" 
                                        className="profile-image-preview" 
                                    />
                                ) : (
                                    <div className="profile-photo-placeholder">
                                        <FaCamera className="upload-icon" />
                                        <span>Click to upload photo</span>
                                    </div>
                                )}
                            </label>
                        </div>

                        <h3 className="profile-name">{username}</h3>
                        <p className="profile-specialization">{specialization}</p>

                        <div className="profile-stats">
                            <div className="stat-item">
                                <strong>{experienceYears || '0+'}</strong>
                                <small>Years Experience</small>
                            </div>
                            <div className="stat-item">
                                <strong>${sessionPrice || '0'}</strong>
                                <small>Session Price</small>
                            </div>
                        </div>

                        <div className="profile-actions-sidebar">
                            <button 
                                className={`sidebar-action-button ${activeTab === 'edit-profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('edit-profile')}
                            >
                                <FaEdit className="button-icon" /> Edit Profile
                            </button>
                            <button 
                                className={`sidebar-action-button ${activeTab === 'change-password' ? 'active' : ''}`}
                                onClick={() => setActiveTab('change-password')}
                            >
                                <FaKey className="button-icon" /> Change Password
                            </button>
                        </div>
                    </div>

                    <div className="profile-content-area">
                        <div className="profile-tabs">
                            <button
                                className={`tab-button ${activeTab === 'information' ? 'active' : ''}`}
                                onClick={() => setActiveTab('information')}
                                disabled={isLoading}
                            >
                                <FaUser className="tab-icon" /> Information
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'edit-profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('edit-profile')}
                                disabled={isLoading}
                            >
                                <FaEdit className="tab-icon" /> Edit Profile
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'change-password' ? 'active' : ''}`}
                                onClick={() => setActiveTab('change-password')}
                                disabled={isLoading}
                            >
                                <FaKey className="tab-icon" /> Change Password
                            </button>
                        </div>
                        <div className="profile-tab-content-wrapper">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <div className="loading-overlay">Loading...</div>}
        </div>
    );
};

export default ProfileDoctor;

