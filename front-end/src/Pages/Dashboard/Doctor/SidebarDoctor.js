import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaUserAlt, 
  FaChartBar, 
  FaUsersCog, 
  FaCalendarCheck, 
  FaAddressBook, 
  FaEdit, 
  FaAngleLeft,
  FaSignOutAlt
} from 'react-icons/fa';
import './SidebarDoctor.css';
import axiosProfile from '../../../utils/axiosProfile';
import Cookie from 'cookie-universal';

const cookies = Cookie();

export default function SidebarDoctor() {
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
        <div className={`doctor-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="doctor-sidebar-toggle-btn" onClick={toggleSidebar} title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                <FaAngleLeft size={16} />
            </button>
            
            <ul className="doctor-sidebar-list">
                <li>
                    <NavLink to="/doctor/dashboardDoctor">
                        <FaChartBar className="doctor-sidebar-icon" />
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/doctor/profileDoctor">
                        <FaUserAlt className="doctor-sidebar-icon" />
                        <span>Profile</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/doctor/ManageSupportGroup">
                        <FaUsersCog className="doctor-sidebar-icon" />
                        <span>Manage Support Group</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/doctor/therapy-sessions">
                        <FaCalendarCheck className="doctor-sidebar-icon" />
                        <span>Manage Therapy Sessions</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/doctor/ManageAboutPatient">
                        <FaAddressBook className="doctor-sidebar-icon" />
                        <span>Manage About Patient</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/doctor/ManageContent">
                        <FaEdit className="doctor-sidebar-icon" />
                        <span>Manage Content</span>
                    </NavLink>
                </li>
                <li>
                    <button 
                        className="logout-link" 
                        onClick={() => setShowConfirm(true)}
                    >
                        <FaSignOutAlt className="doctor-sidebar-icon" />
                        <span>Logout</span>
                    </button>
                </li>
            </ul>

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

            {logoutError && (
                <div className="logout-error-message">
                    Logout failed. Please try again.
                </div>
            )}
            
            <div className="doctor-user">
                <div className="doctor-user-avatar">
                    D
                </div>
                <div className="doctor-user-info">
                    <div className="doctor-user-name">Doctor User</div>
                    <div className="doctor-user-role">Doctor</div>
                </div>
            </div>
        </div>
    );
}