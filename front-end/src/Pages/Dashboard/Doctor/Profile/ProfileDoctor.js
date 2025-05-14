import React, { useState, useEffect, useCallback } from 'react';
import axiosProfile from "../../../../utils/axiosProfile";
import './ProfileDoctor.css';
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';

const ProfileDoctor = () => {
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

    const fetchDoctorInfo = useCallback(async () => {
        try {
            const response = await axiosProfile.get('/auth/user/');
            console.log('User info response:', response.data);

            const data = response.data.data || response.data;
            setUsername(data.username);

            if (data.profile_photo) {
                setProfilePhoto(`http://127.0.0.1:8000${data.profile_photo}`);
            } else {
                setProfilePhoto('/path/to/default/image.jpg');
            }
        } catch (error) {
            console.error("There was an error fetching the doctor info!", error);
        }
    }, []);

    const fetchDoctorProfile = useCallback(async () => {
        try {
            const response = await axiosProfile.get('/auth/profile/');
            console.log('Doctor profile response:', response.data);

            const data = response.data;
            setSpecialization(data.specialization);
            setAge(data.age);
            setSessionPrice(data.session_price);
            setExperienceYears(data.experience_years);
            setSessionDuration(data.session_duration);

            if (data.profile_picture && !profilePhoto) {
                setProfilePhoto(`http://127.0.0.1:8000${data.profile_picture}`);
            }
        } catch (error) {
            console.error("There was an error fetching the doctor profile!", error);
        }
    }, [profilePhoto]);

    // useEffect لجلب البيانات عند تحميل المكون
    useEffect(() => {
        fetchDoctorInfo();
        fetchDoctorProfile();
    }, [fetchDoctorInfo, fetchDoctorProfile]);

    const updateProfile = async (e) => {
        e.preventDefault();
        setProfileMessage('');
        try {
            const userData = new FormData();
            userData.append('username', username);
            if (profilePhoto && typeof profilePhoto !== 'string') {
                userData.append('profile_photo', profilePhoto);
            }

            await axiosProfile.patch('/auth/account-info', userData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const formData = new FormData();
            formData.append('specialization', specialization);
            formData.append('age', age);
            formData.append('session_price', sessionPrice);
            formData.append('experience_years', experienceYears);
            formData.append('session_duration', sessionDuration);

            if (profilePhoto && typeof profilePhoto !== 'string') {
                formData.append('profile_picture', profilePhoto);
            }

            const response = await axiosProfile.put('/auth/profile/', formData, {
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
        <div className="doctor-profile-container">
            <SidebarDoctor />
            <Navbar />
            <div className="doctor-profile-content">
                <h1>Doctor Profile</h1>
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
                <form onSubmit={updateProfile} className="doctor-profile-form">
                    <h3>Modify Your Account Information Here</h3>
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>Specialization</label>
                    <input
                        type="text"
                        placeholder="Specialization"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                    />
                    <label>Age</label>
                    <input
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                    <label>Session Price</label>
                    <input
                        type="text"
                        placeholder="Session Price"
                        value={sessionPrice}
                        onChange={(e) => setSessionPrice(e.target.value)}
                    />
                    <label>Experience Years</label>
                    <input
                        type="number"
                        placeholder="Experience Years"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                    />
                    <label>Session Duration</label>
                    <select
                        value={sessionDuration}
                        onChange={(e) => setSessionDuration(e.target.value)}
                    >
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                    </select>
                    <label>Change Profile Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setProfilePhoto(e.target.files[0]);
                        }}
                        className="change-picture-btn"
                    />
                    <button type="submit" className="save-button">
                        Update Profile
                    </button>
                    {profileMessage && <p className="message">{profileMessage}</p>}
                </form>
                <form onSubmit={changePassword} className="doctor-profile-form">
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

export default ProfileDoctor;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./ProfileDoctor.css";
// import Navbar from "../NavBardoctor";
// import SidebarDoctor from "../SidebarDoctor";

// const ProfileDoctor = () => {
//     const [doctorData, setDoctorData] = useState({
//         name: "",
//         age: "",
//         education: "",
//         specialties: "",
//         skills: "",
//         rating: 4.8,
//         sessionPrice: "",
//         profilePhoto: "/default/image.jpg",
//     });

//     const [isEditing, setIsEditing] = useState(false);
//     const [tempData, setTempData] = useState({ ...doctorData });

//     // جلب بيانات الطبيب من الـ Backend
//     useEffect(() => {
//         const fetchDoctorProfile = async () => {
//             try {
//                 const response = await axios.get("/api/doctor-profile");
//                 setDoctorData(response.data);
//                 setTempData(response.data);
//             } catch (error) {
//                 console.error("Error fetching doctor profile:", error);
//             }
//         };
//         fetchDoctorProfile();
//     }, []);

//     // فتح نافذة التعديل
//     const openEditModal = () => {
//         setTempData({ ...doctorData });
//         setIsEditing(true);
//     };

//     // إغلاق نافذة التعديل
//     const closeEditModal = () => {
//         setIsEditing(false);
//     };

//     // تحديث البيانات عند تعديل النموذج
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setTempData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     // رفع الصورة الشخصية الجديدة
//     const handlePhotoChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setTempData((prevData) => ({
//                 ...prevData,
//                 profilePhoto: URL.createObjectURL(file),
//             }));
//         }
//     };

//     // إرسال التحديثات إلى الـ Backend
//     const saveChanges = async () => {
//         try {
//             await axios.put("/api/update-profile", tempData);
//             setDoctorData(tempData);
//             closeEditModal();
//             alert("Profile updated successfully!");
//         } catch (error) {
//             console.error("Error updating profile:", error);
//         }
//     };

//     return (
//         <div className="doctor-profile-container">
//             <SidebarDoctor />
//             <Navbar />
//             <div className="doctor-profile-content">
//                 <h1>Doctor Profile</h1>
//                 <button className="edit-profile-btn" onClick={openEditModal}>
//                     Edit Profile
//                 </button>
//                 <div className="profile-section">
//                     <div className="profile-photo">
//                         <img src={doctorData.profilePhoto} alt="Doctor Profile" />
//                     </div>
//                     <div className="doctor-details">
//                         <h2>{doctorData.name}</h2>
//                         <p>Age: {doctorData.age}</p>
//                         <p>Education: {doctorData.education}</p>
//                         <p>Specialties: {doctorData.specialties}</p>
//                         <p>Skills: {doctorData.skills}</p>
//                         <p>Rating: {doctorData.rating} ⭐</p>
//                         <p>Session Price: ${doctorData.sessionPrice}</p>
//                     </div>
//                 </div>

//                 {/* نافذة تعديل البيانات */}
//                 {isEditing && (
//                     <div className="edit-modal">
//                         <div className="modal-content">
//                             <h2>Edit Profile</h2>
//                             <label>Name</label>
//                             <input type="text" name="name" value={tempData.name} onChange={handleInputChange} />
//                             <label>Age</label>
//                             <input type="number" name="age" value={tempData.age} onChange={handleInputChange} />
//                             <label>Education</label>
//                             <input type="text" name="education" value={tempData.education} onChange={handleInputChange} />
//                             <label>Specialties</label>
//                             <input type="text" name="specialties" value={tempData.specialties} onChange={handleInputChange} />
//                             <label>Skills</label>
//                             <input type="text" name="skills" value={tempData.skills} onChange={handleInputChange} />
//                             <label>Session Price</label>
//                             <input type="number" name="sessionPrice" value={tempData.sessionPrice} onChange={handleInputChange} />
//                             <label>Change Profile Photo</label>
//                             <input type="file" onChange={handlePhotoChange} />
//                             <div className="modal-buttons">
//                                 <button className="cancel-btn" onClick={closeEditModal}>Cancel</button>
//                                 <button className="save-btn" onClick={saveChanges}>Save Changes</button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProfileDoctor;
