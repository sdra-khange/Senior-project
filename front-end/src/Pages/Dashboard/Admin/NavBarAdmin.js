import React from "react";
import { useLocation } from "react-router-dom";
import { FaSearch, FaBell } from 'react-icons/fa';
import './NavBarAdmin.css';

export default function Navbar() {
    const location = useLocation();
    let pageTitle = '';
    let pageSubtitle = '';

    switch (location.pathname) {
        case '/admin/dashboard':
            pageTitle = 'Dashboard';
            pageSubtitle = 'Welcome to your dashboard';
            break;
        case '/admin/manage-domains':
            pageTitle = 'Manage Domains';
            pageSubtitle = 'Manage your domain settings and preferences';
            break;
        case '/admin/profile':
            pageTitle = 'Profile';
            
            break;
        case '/admin/manage-doctors':
            pageTitle = 'Manage Doctors';
            pageSubtitle = 'Manage your doctors and their information';
            break;
        case '/admin/manage-tests':
            pageTitle = 'Manage Tests';
            pageSubtitle = 'Manage your tests and their settings';
            break;
        default:
            pageTitle = 'Page';
            pageSubtitle = 'Page description';
    }

    return (
        <div className="admin-navbar">
            <div className="admin-logo">Better Together</div>
            <div className="page-info">
                <h1 className="page-title">{pageTitle}</h1>
                <p className="page-subtitle">{pageSubtitle}</p>
            </div>
            <div className="navbar-right">
                <div className="search-container">
                    <FaSearch />
                    <input type="text" placeholder="Search..." />
                </div>
                <div className="notification-icon">
                    <FaBell size={20} />
                    <span className="notification-badge">4</span>
                </div>
            </div>
        </div>
    );
}