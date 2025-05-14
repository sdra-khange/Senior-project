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
                    setUsername(data.username); // تعيين اسم المستخدم الحالي
                    setProfilePhoto(data.profile_photo); // تعيين الصورة الشخصية الحالية
                    localStorage.setItem('profilePhoto', data.profile_photo); // تخزين الصورة الشخصية في الذاكرة المحلية
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
            console.log([...formData]); // تحقق من محتويات البيانات المرسلة
            const response = await axiosProfile.patch('/auth/account-info', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setProfileMessage('Your profile has been updated successfully.');
                // تحديث الحالة بالصورة التي تم تحميلها وتخزينها في الذاكرة المحلية
                const updatedPhoto = typeof profilePhoto === 'string' ? profilePhoto : URL.createObjectURL(profilePhoto);
                setProfilePhoto(updatedPhoto);
                localStorage.setItem('profilePhoto', updatedPhoto);
            } else {
                setProfileMessage('An unexpected error occurred.');
            }
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error.message);
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
            } else {
                setPasswordMessage('An unexpected error occurred.');
            }
        } catch (error) {
            console.error('Error changing password:', error.response ? error.response.data : error.message);
            setPasswordMessage('An error occurred while changing the password.');
        }
    };

    return (
        <div className="admin-page">
            <NavBarAdmin className="nav-bar" />
            <Sidebar className="sidebar" />
            <div className="content-wrapper">
                <div className="profile-content">
                    <h1>Profile</h1>
                    <form onSubmit={updateProfile} className="profile-form">
                        <h3>Modify your account information here</h3>
                        <label>Username</label>
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        {profilePhoto && <img src={typeof profilePhoto === 'string' ? profilePhoto : URL.createObjectURL(profilePhoto)} alt="Profile" className="profile-image" />}
                        <label>Change Profile Photo</label>
                        <input type="file" onChange={(e) => setProfilePhoto(e.target.files[0])} className="change-picture-btn" />
                        <div className="form-buttons">
                            <button type="submit" className="save-button">Update Profile</button>
                            {profileMessage && <p className="message">{profileMessage}</p>}
                        </div>
                    </form>
                    <form onSubmit={changePassword} className="profile-form">
                        <label>Old Password</label>
                        <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        <label>New Password</label>
                        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <label>Confirm New Password</label>
                        <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <div className="form-buttons">
                            <button type="submit" className="save-button">Change Password</button>
                            {passwordMessage && <p className="message">{passwordMessage}</p>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
