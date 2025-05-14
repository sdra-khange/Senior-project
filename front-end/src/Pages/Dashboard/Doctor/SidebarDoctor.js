import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserAlt, FaChartBar, FaUsersCog, FaClipboardList, FaCalendarCheck, FaAddressBook, FaEdit, FaSignOutAlt, FaBars } from 'react-icons/fa';
import './SidebarDoctor.css'; 

export default function SidebarDoctor() {
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
                        <NavLink to="/doctor/profileDoctor">
                            <FaUserAlt className="sidebar-doctor-icon" /> Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/doctor/dashboardDoctor">
                            <FaChartBar className="sidebar-doctor-icon" /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/doctor/ManageSupportGroup">
                            <FaUsersCog className="sidebar-doctor-icon" /> Manage Support Group
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/doctor/ViewListAppointment">
                            <FaClipboardList className="sidebar-doctor-icon" /> View List of Appointment
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/doctor/manage-booking-schedule">
                            <FaCalendarCheck className="sidebar-doctor-icon" /> Manage Booking Schedule
                        </NavLink>
                    </li>
                    <li>
                    <NavLink to="/doctor/ManageAboutPatient">
                            <FaAddressBook className="sidebar-doctor-icon" /> Manage About Patient  
                    </NavLink>
                    </li>
                    <li>
                    <NavLink to="/doctor/ManageContent">
                            <FaEdit className="sidebar-doctor-icon" /> Manage Content  
                    </NavLink>
                    </li>
                    <li>
                    <NavLink to="/doctor/manage-tests">
                            <FaSignOutAlt className="sidebar-doctor-icon" /> Logout  
                    </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
}
