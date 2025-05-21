import React, { useState, useEffect } from 'react';
import axiosProfile from "../../../utils/axiosProfile";
import Sidebar from "../Admin/Sidebar";
import NavBarAdmin from "../Admin/NavBarAdmin";
import './ProfileAdmin.css';

const Profile = () => {
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedProfilePhoto = localStorage.getItem('profilePhoto');
        if (storedUserId) {
            setUserId(storedUserId);
        }
        if (storedProfilePhoto) {
            setProfilePhoto(storedProfilePhoto);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchUserInfo = async () => {
                try {
                    const response = await axiosProfile.get(`/auth/user/${userId}`);
                    const data = response.data.data;
                    setUsername(data.username);
                    setProfilePhoto(data.profile_photo);
                    localStorage.setItem('profilePhoto', data.profile_photo);
                } catch (error) {
                    console.error("There was an error fetching the user info!", error);
                }
            };
            fetchUserInfo();
        }
    }, [userId]);

    const updateProfile = async (e) => {
        e.preventDefault();
        setProfileMessage('');
        try {
            const formData = new FormData();
            formData.append('username', username);
            if (profilePhoto && typeof profilePhoto !== 'string') {
                formData.append('profile_photo', profilePhoto);
            }
            const response = await axiosProfile.patch('/auth/account-info', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setProfileMessage('Your profile has been updated successfully.');
                const updatedPhoto = typeof profilePhoto === 'string' ? profilePhoto : URL.createObjectURL(profilePhoto);
                setProfilePhoto(updatedPhoto);
                localStorage.setItem('profilePhoto', updatedPhoto);
            }
        } catch (error) {
            setProfileMessage('An error occurred while updating the profile.');
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage('');
        if (newPassword !== confirmPassword) {
            setPasswordMessage('New password and confirm password do not match.');
            return;
        }
        try {
            const response = await axiosProfile.put('/auth/password', {
                old_password: oldPassword,
                new_password: newPassword
            });
            if (response.status === 200) {
                setPasswordMessage('Password changed successfully.');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            setPasswordMessage('An error occurred while changing the password.');
        }
    };

    return (
        <div className="admin-page">
            <Sidebar />
            <NavBarAdmin />
            <div className="profile-content">
                <div className="profile-header">
                    <img src={profilePhoto || '/default-avatar.png'} alt="Profile" />
                    <div className="profile-header-text">
                        <h1>Admin Profile</h1>
                        <p>Manage your account settings and preferences</p>
                    </div>
                </div>

                <div className="tab-container">
                    <button 
                        className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'photo' ? 'active' : ''}`}
                        onClick={() => setActiveTab('photo')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                        </svg>
                        Photo
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveTab('password')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Password
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <form onSubmit={updateProfile} className="profile-form">
                        <div className="form-section">
                            <h3>Update Username</h3>
                            <p>Change how your name appears across your account</p>
                            <input 
                                type="text" 
                                placeholder="Username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>
                        <button type="submit" className="save-button">Update Username</button>
                        {profileMessage && <p className="message">{profileMessage}</p>}
                    </form>
                )}

                {activeTab === 'photo' && (
                    <form onSubmit={updateProfile} className="profile-form">
                        <div className="form-section">
                            <h3>Change Profile Photo</h3>
                            <p>Upload a new profile picture or drag and drop</p>
                            <div className="profile-image-upload">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                                </svg>
                                <p>Drag & drop your image here</p>
                                <p>or</p>
                                <input
                                    type="file"
                                    id="profile-photo"
                                    style={{ display: 'none' }}
                                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                                    accept="image/jpeg,image/png,image/gif"
                                />
                                <label htmlFor="profile-photo" className="browse-files">Browse Files</label>
                                <p className="supported-formats">Supported formats: JPG, PNG, GIF (Max size: 5MB)</p>
                            </div>
                            <button type="submit" className="save-button">Update Photo</button>
                            {profileMessage && <p className="message">{profileMessage}</p>}
                        </div>
                    </form>
                )}

                {activeTab === 'password' && (
                    <form onSubmit={changePassword} className="profile-form">
                        <div className="form-section">
                            <h3>Change Password</h3>
                            <p>Update your password to keep your account secure</p>
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="save-button">Update Password</button>
                        {passwordMessage && <p className="message">{passwordMessage}</p>}
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;

