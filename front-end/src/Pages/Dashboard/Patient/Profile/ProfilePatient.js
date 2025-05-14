import React, { useState, useEffect, useCallback } from 'react';
import axiosProfile from "../../../../utils/axiosProfile";
import './ProfilePatient.css';
import SidebarPatient from '../SidebarPatient';
import Navbar from '../NavBarPatient';

const ProfilePatient = () => {
    const [username, setUsername] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    // Function to fetch patient information
    const fetchPatientInfo = useCallback(async () => {
        try {
            const response = await axiosProfile.get('/auth/user/');
            const data = response.data.data || response.data;
            setUsername(data.username);

            if (data.profile_photo) {
                setProfilePhoto(`http://127.0.0.1:8000${data.profile_photo}`);
            } else {
                setProfilePhoto('/path/to/default/image.jpg'); // Provide a default image path here
            }
        } catch (error) {
            console.error("There was an error fetching the patient info!", error);
        }
    }, []);

    useEffect(() => {
        fetchPatientInfo();
    }, [fetchPatientInfo]);

    const updateProfile = async (e) => {
        e.preventDefault();
        setProfileMessage('');
        try {
            // Update basic user information (username and profile_photo)
            const userData = new FormData();
            userData.append('username', username);
            if (profilePhoto && typeof profilePhoto !== 'string') {
                userData.append('profile_photo', profilePhoto);
            }

            await axiosProfile.patch('/auth/account-info/', userData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update patient's medical record
            const formData = new FormData();
            if (medicalRecord) {
                formData.append('medical_record', medicalRecord);
            }

            const response = await axiosProfile.put('/patient-profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                setProfileMessage('Your profile has been updated successfully.');
            } else {
                setProfileMessage('An unexpected error occurred.');
            }
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error.message);
            setProfileMessage(`An error occurred while updating the profile: ${error.response ? error.response.data : error.message}`);
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
                // Reset fields after success
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setPasswordMessage('An unexpected error occurred.');
            }
        } catch (error) {
            console.error('Error changing password:', error.response ? error.response.data : error.message);
            setPasswordMessage(error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'An error occurred while changing the password.');
        }
    };

    return (
        <div className="patient-profile-container">
            <SidebarPatient />
            <Navbar />
            <div className="patient-profile-content">
                <h1>Patient Profile</h1>
                <div className="profile-top-section">
                    <div className="left-section">
                        <h3>{username}</h3>
                    </div>
                    <div className="right-section profile-picture">
                        {profilePhoto && (
                            <img
                                src={
                                    typeof profilePhoto === 'string' && profilePhoto.startsWith('http')
                                        ? profilePhoto
                                        : URL.createObjectURL(profilePhoto)
                                }
                                alt="Profile"
                                className="profile-image"
                            />
                        )}
                    </div>
                </div>
                <form onSubmit={updateProfile} className="patient-profile-form">
                    <h3>Modify Your Account Information Here</h3>
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>Change Profile Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setProfilePhoto(e.target.files[0]);
                        }}
                        className="change-picture-btn"
                    />
                    <label>Add Medical Record</label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt" // Adjust allowed file types as needed
                        onChange={(e) => {
                            setMedicalRecord(e.target.files[0]);
                        }}
                        className="upload-medical-record-btn"
                    />
                    <button type="submit" className="save-button">
                        Update Profile
                    </button>
                    {profileMessage && <p className="message">{profileMessage}</p>}
                </form>
                <form onSubmit={changePassword} className="patient-profile-form">
                    <h3>Change Password</h3>
                    <label>Old Password</label>
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <label>New Password</label>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit" className="save-button">
                        Change Password
                    </button>
                    {passwordMessage && <p className="message">{passwordMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default ProfilePatient;