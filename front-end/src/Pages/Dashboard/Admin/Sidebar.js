
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaChartBar, FaGlobe, FaStethoscope, FaBars,FaTasks } from 'react-icons/fa';
import './Sidebar.css';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                <FaBars />
            </button>
            <div className={`sidebar ${isOpen ? 'open' : 'close'}`}>
                <ul className="sidebar-list">
                    <li>
                        <NavLink to="/admin/profile">
                            <FaUser className="sidebar-icon" /> Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/dashboard">
                            <FaChartBar className="sidebar-icon" /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/manage-domains">
                            <FaGlobe className="sidebar-icon" /> Manage Domains
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/manage-doctors">
                            <FaStethoscope className="sidebar-icon" /> Manage Doctors
                        </NavLink>
                    </li>
                    <li>
                    <NavLink to="/admin/manage-tests">
                            <FaTasks className="sidebar-icon" /> Manage Tests
                    </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
}