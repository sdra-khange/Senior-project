// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { 
//   FaUserAlt, 
//   FaCalendarAlt, 
//   FaClipboardList, 
//   FaHospitalUser, 
//   FaCommentAlt, 
//   FaFileSignature,
//   FaSignOutAlt,
//   FaAngleLeft,
// } from 'react-icons/fa';
// import './SidebarPatient.css';

// export default function SidebarPatient() {
//     const [isCollapsed, setIsCollapsed] = useState(false);

//     const toggleSidebar = () => {
//         setIsCollapsed(!isCollapsed);
//     };

//     return (
//         <div className={`patient-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
//             <button className="patient-sidebar-toggle-btn" onClick={toggleSidebar} title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
//                 <FaAngleLeft size={16} />
//             </button>
            
//             <ul className="patient-sidebar-list">
//                 <li>
//                     <NavLink to="/patient/profilePatient">
//                         <FaUserAlt className="patient-sidebar-icon" />
//                         <span>Profile</span>
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/patient/appointments">
//                         <FaCalendarAlt className="patient-sidebar-icon" />
//                         <span>My Appointments</span>
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/patient/doctors">
//                         <FaHospitalUser className="patient-sidebar-icon" />
//                         <span>Find Doctors</span>
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/patient/tests">
//                         <FaFileSignature className="patient-sidebar-icon" />
//                         <span>Psychological Tests</span>
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/patient/community">
//                         <FaCommentAlt className="patient-sidebar-icon" />
//                         <span>Community</span>
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/patient/medical-records">
//                         <FaClipboardList className="patient-sidebar-icon" />
//                         <span>Medical Records</span>
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/logout">
//                         <FaSignOutAlt className="patient-sidebar-icon" />
//                         <span>Logout</span>
//                     </NavLink>
//                 </li>
//             </ul>
            
//             <div className="patient-user">
//                 <div className="patient-user-avatar">
//                     P
//                 </div>
//                 <div className="patient-user-info">
//                     <div className="patient-user-name">Patient User</div>
//                     <div className="patient-user-role">Patient</div>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaUserAlt, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaHospitalUser, 
  FaCommentAlt, 
  FaFileSignature,
  FaSignOutAlt,
  FaAngleLeft,
} from 'react-icons/fa';
import './SidebarPatient.css';
import axiosProfile from '../../../utils/axiosProfile';
import Cookie from 'cookie-universal';

const cookies = Cookie();

export default function SidebarPatient() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [logoutError, setLogoutError] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = async () => {
        try {
            const refreshToken = cookies.get('refresh-token');
            if (refreshToken) {
                await axiosProfile.post('/auth/logout/', { refresh_token: refreshToken });
            }

            // Clear all stored data
            cookies.remove('auth-token');
            cookies.remove('refresh-token');
            localStorage.clear();

            // Redirect to home page
            window.location.href = 'http://localhost:3000/';
            
        } catch (error) {
            console.error('Logout error:', error);
            setLogoutError(true);
            setTimeout(() => setLogoutError(false), 3000);
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <div className={`patient-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="patient-sidebar-toggle-btn" onClick={toggleSidebar} title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                <FaAngleLeft size={16} />
            </button>
            
            <ul className="patient-sidebar-list">
                <li>
                    <NavLink to="/patient/profilePatient">
                        <FaUserAlt className="patient-sidebar-icon" />
                        <span>Profile</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/patient/appointments">
                        <FaCalendarAlt className="patient-sidebar-icon" />
                        <span>My Appointments</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/patient/doctors">
                        <FaHospitalUser className="patient-sidebar-icon" />
                        <span>Find Doctors</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/patient/tests">
                        <FaFileSignature className="patient-sidebar-icon" />
                        <span>Psychological Tests</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/patient/community">
                        <FaCommentAlt className="patient-sidebar-icon" />
                        <span>Community</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/patient/medical-records">
                        <FaClipboardList className="patient-sidebar-icon" />
                        <span>Medical Records</span>
                    </NavLink>
                </li>
                <li>
                    <button 
                        className="logout-link" 
                        onClick={() => setShowConfirm(true)}
                    >
                        <FaSignOutAlt className="patient-sidebar-icon" />
                        <span>Logout</span>
                    </button>
                </li>
            </ul>

            {/* رسالة التأكيد */}
            {showConfirm && (
                <div className="logout-confirmation-overlay">
                    <div className="logout-confirmation">
                        <p>Are you sure you want to logout?</p>
                        <div className="confirmation-buttons">
                            <button onClick={handleLogout}>Yes</button>
                            <button onClick={() => setShowConfirm(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}

            {/* رسالة الخطأ */}
            {logoutError && (
                <div className="logout-error-message">
                    Logout failed. Please try again.
                </div>
            )}
            
            <div className="patient-user">
                <div className="patient-user-avatar">
                    P
                </div>
                <div className="patient-user-info">
                    <div className="patient-user-name">Patient User</div>
                    <div className="patient-user-role">Patient</div>
                </div>
            </div>
        </div>
    );
}