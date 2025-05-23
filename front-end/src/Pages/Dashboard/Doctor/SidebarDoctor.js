import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserAlt, FaChartBar, FaUsersCog, FaCalendarCheck, FaAddressBook, FaEdit, FaAngleLeft } from 'react-icons/fa';
import './SidebarDoctor.css';
// FaClipboardList

export default function SidebarDoctor() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
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
                {/* <li>
                    <NavLink to="/doctor/ViewListAppointment">
                        <FaClipboardList className="doctor-sidebar-icon" />
                        <span>View List of Appointment</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/doctor/manage-booking-schedule">
                        <FaCalendarCheck className="doctor-sidebar-icon" />
                        <span>Manage Booking Schedule</span>
                    </NavLink>
                </li> */}
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
            </ul>
            
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
