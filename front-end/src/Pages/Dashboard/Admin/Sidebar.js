import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaChartBar, FaGlobe, FaStethoscope, FaTasks, FaAngleLeft } from 'react-icons/fa';
import './Sidebar.css';

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="toggle-btn" onClick={toggleSidebar} title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                <FaAngleLeft size={16} />
            </button>
            
            <ul className="sidebar-list">
                <li>
                    <NavLink to="/admin/dashboard">
                        <FaChartBar className="sidebar-icon" />
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/profile">
                        <FaUser className="sidebar-icon" />
                        <span>Profile</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/manage-domains">
                        <FaGlobe className="sidebar-icon" />
                        <span>Manage Domains</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/manage-doctors">
                        <FaStethoscope className="sidebar-icon" />
                        <span>Manage Doctors</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/manage-tests">
                        <FaTasks className="sidebar-icon" />
                        <span>Manage Tests</span>
                    </NavLink>
                </li>
            </ul>
            
            <div className="admin-user">
                <div className="admin-user-avatar">
                    A
                </div>
                <div className="admin-user-info">
                    <div className="admin-user-name">Admin User</div>
                    <div className="admin-user-role">Administrator</div>
                </div>
            </div>
        </div>
    );
}