import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserAlt, FaCalendarAlt, FaClipboardList, FaHospitalUser, FaCommentAlt, FaFileSignature, FaSignOutAlt, FaBars } from 'react-icons/fa';
import './SidebarDoctor.css';

export default function SidebarPatient() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button className="sidebar-doctor-toggle-btn" onClick={toggleSidebar}>
                <FaBars />
            </button>
            <div className={`sidebar-doctor ${isOpen ? 'sidebar-doctor-open' : 'sidebar-doctor-close'}`}>
                <ul className="sidebar-doctor-list">
                    <li>
                        <NavLink to="/patient/profilePatient">
                            <FaUserAlt className="sidebar-doctor-icon" /> Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/patient/Appointment-Booking">
                            <FaCalendarAlt className="sidebar-doctor-icon" /> Appointment Booking 
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/patient/manage-sessions">
                            <FaClipboardList className="sidebar-doctor-icon" /> Manage sessions
                        </NavLink>
                    </li>
                    <li>
                    <NavLink to="/patient/ManageAboutDoctor">
                            <FaHospitalUser className="sidebar-doctor-icon" /> Manage About Doctors  
                    </NavLink>
                    </li>
                    <li>
                    <NavLink to="/patient/Share-memories">
                            <FaCommentAlt className="sidebar-doctor-icon" /> Share Memories 
                    </NavLink>
                    </li>
                    <li>
                    <NavLink to="/patient/Answer-Psychological-Test">
                            <FaFileSignature className="sidebar-doctor-icon" /> Answer Psychological Test
                    </NavLink>
                    </li>
                    <li>
                    <NavLink to="/patient/manage-tests">
                            <FaSignOutAlt className="sidebar-doctor-icon" /> Logout  
                    </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
}
