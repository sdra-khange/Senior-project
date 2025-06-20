import React, { useState, useEffect, useCallback } from 'react';
import axiosProfile from "../../../../utils/axiosProfile";
import './ProfilePatient.css';
import NavbarPatient from '../NavBarPatient';
import SidebarPatient from '../SidebarPatient';
import Cookie from 'cookie-universal';
import { FaUser, FaEdit, FaKey, FaCamera, FaAllergies, FaPills } from 'react-icons/fa';

const cookie = Cookie();

const ProfilePatient = () => {
    const [username, setUsername] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [allergies, setAllergies] = useState('');
    const [medications, setMedications] = useState('');
    const [chronicDiseases, setChronicDiseases] = useState('');
    const [address, setAddress] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('information');

    useEffect(() => {
        const token = cookie.get("auth-token");
        if (!token) {
            window.location.href = '/login';
        }
    }, []);

    const fetchPatientInfo = useCallback(async () => {
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
                window.location.href = '/login';
            }
        }
    }, []);

    const fetchPatientProfile = useCallback(async () => {
        try {
            const response = await axiosProfile.get('/auth/patient/profile/');
            const data = response.data;
            
            setAge(data.age || '');
            setGender(data.gender || '');
            setAllergies(data.allergies || 'None');
            setMedications(data.medications || 'None');
            setChronicDiseases(data.chronic_diseases || 'None');
            setAddress(data.address || '');

            if (data.profile_picture && !profilePhoto) {
                setProfilePhoto(`http://127.0.0.1:8000${data.profile_picture}`);
            }
        } catch (error) {
            console.error("Error fetching patient profile:", error);
        }
    }, [profilePhoto]);

    useEffect(() => {
        fetchPatientInfo();
        fetchPatientProfile();
    }, [fetchPatientInfo, fetchPatientProfile]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        setProfileMessage('');
        setIsLoading(true);

        try {
            const userData = new FormData();
            userData.append('username', username);
            if (profilePhoto && typeof profilePhoto !== 'string') {
                userData.append('profile_photo', profilePhoto);
            }

            await axiosProfile.patch('/auth/account-info', userData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const formData = new FormData();
            formData.append('age', age);
            formData.append('gender', gender);
            formData.append('allergies', allergies);
            formData.append('medications', medications);
            formData.append('chronic_diseases', chronicDiseases);
            formData.append('address', address);

            if (profilePhoto && typeof profilePhoto !== 'string') {
                formData.append('profile_picture', profilePhoto);
            }

            await axiosProfile.put('/auth/patient/profile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfileMessage('Profile updated successfully.');
            
        } catch (error) {
            setProfileMessage(error.response?.data?.message || 'Error updating profile');
        } finally {
            setIsLoading(false);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage('');
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            setPasswordMessage('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await axiosProfile.put('/auth/password', {
                old_password: oldPassword,
                new_password: newPassword
            });
            setPasswordMessage('Password changed successfully');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordMessage(error.response?.data?.message || 'Error changing password');
        } finally {
            setIsLoading(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'information':
                return (
                    <div className="tab-content">
                        <h3><FaUser className="tab-icon" /> Personal Information</h3>
                        <div className="info-grid">
                            <div className="info-item"><strong>Full Name:</strong> <p>{username}</p></div>
                            <div className="info-item"><strong>Age:</strong> <p>{age || 'N/A'}</p></div>
                            <div className="info-item"><strong>Gender:</strong> <p>{gender || 'N/A'}</p></div>
                            <div className="info-item"><strong>Address:</strong> <p>{address || 'N/A'}</p></div>
                        </div>
                        
                        <h3><FaAllergies className="tab-icon" /> Medical Information</h3>
                        <div className="info-grid">
                            <div className="info-item"><strong>Allergies:</strong> <p>{allergies || 'None'}</p></div>
                            <div className="info-item"><strong>Medications:</strong> <p>{medications || 'None'}</p></div>
                            <div className="info-item"><strong>Chronic Diseases:</strong> <p>{chronicDiseases || 'None'}</p></div>
                        </div>
                    </div>
                );
            case 'edit-profile':
                return (
                    <div className="tab-content">
                        <h3><FaEdit className="tab-icon" /> Edit Profile</h3>
                        <form onSubmit={updateProfile} className="profile-edit-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        disabled={isLoading}
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label><FaAllergies /> Allergies</label>
                                    <input
                                        type="text"
                                        value={allergies}
                                        onChange={(e) => setAllergies(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label><FaPills /> Medications</label>
                                    <input
                                        type="text"
                                        value={medications}
                                        onChange={(e) => setMedications(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Chronic Diseases</label>
                                    <textarea
                                        value={chronicDiseases}
                                        onChange={(e) => setChronicDiseases(e.target.value)}
                                        disabled={isLoading}
                                        rows="4"
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
                                    {profilePhoto ? (
                                        <img 
                                            src={typeof profilePhoto === 'string' ? profilePhoto : URL.createObjectURL(profilePhoto)} 
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
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
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
        <div className="patient-profile-page">
            <SidebarPatient />
            <NavbarPatient />
            <div className="patient-profile-main-content">
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
                                {profilePhoto ? (
                                    <img 
                                        src={typeof profilePhoto === 'string' ? profilePhoto : URL.createObjectURL(profilePhoto)} 
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
                        <p className="profile-role">Patient</p>

                        <div className="profile-stats">
                            <div className="stat-item">
                                <strong>{age || 'N/A'}</strong>
                                <small>Age</small>
                            </div>
                            <div className="stat-item">
                                <strong>{gender || 'N/A'}</strong>
                                <small>Gender</small>
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
                            >
                                <FaUser className="tab-icon" /> Information
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'edit-profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('edit-profile')}
                            >
                                <FaEdit className="tab-icon" /> Edit Profile
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'change-password' ? 'active' : ''}`}
                                onClick={() => setActiveTab('change-password')}
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

export default ProfilePatient;