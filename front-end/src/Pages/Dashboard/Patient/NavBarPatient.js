import React from "react";
import { useLocation } from "react-router-dom";
import { FaSearch, FaBell } from 'react-icons/fa';
import './NavBarPatient.css';

export default function NavbarPatient() {
    const location = useLocation();
    let pageTitle = '';
    let pageSubtitle = '';

    switch (location.pathname) {
        case '/patient/dashboard':
            pageTitle = 'Dashboard';
            pageSubtitle = 'Your health overview';
            break;
        case '/patient/profile':
            pageTitle = 'Profile';
            pageSubtitle = 'Manage your personal information';
            break;
        case '/patient/appointments':
            pageTitle = 'My Appointments';
            pageSubtitle = 'View and manage your appointments';
            break;
        case '/patient/doctors':
            pageTitle = 'Find Doctors';
            pageSubtitle = 'Browse and connect with specialists';
            break;
        case '/patient/tests':
            pageTitle = 'Psychological Tests';
            pageSubtitle = 'Take and view your test results';
            break;
        case '/patient/community':
            pageTitle = 'Community';
            pageSubtitle = 'Connect with others';
            break;
        case '/patient/medical-records':
            pageTitle = 'Medical Records';
            pageSubtitle = 'Your health history';
            break;
        default:
            pageTitle = 'Page';
            pageSubtitle = 'Page description';
    }

    return (
        <div className="patient-navbar">
            <div className="patient-logo">Better Together</div>
            <div className="page-info">
                <h1 className="patient-page-title">{pageTitle}</h1>
                <p className="page-subtitle">{pageSubtitle}</p>
            </div>
            <div className="navbar-right">
                <div className="search-container">
                    <FaSearch />
                    <input type="text" placeholder="Search..." />
                </div>
                <div className="notification-icon">
                    <FaBell size={20} />
                    <span className="notification-badge">2</span>
                </div>
            </div>
        </div>
    );
}