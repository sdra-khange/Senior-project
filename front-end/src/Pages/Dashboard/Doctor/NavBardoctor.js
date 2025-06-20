import React from "react";
import { useLocation } from "react-router-dom";
import { FaSearch, FaBell } from 'react-icons/fa';
import './NavBarDoctor.css';

export default function Navbar() {
    const location = useLocation();
    let pageTitle = '';
    let pageSubtitle = '';

    switch (location.pathname) {
        case '/doctor/dashboardDoctor':
            pageTitle = 'Dashboard';
            pageSubtitle = 'Welcome to your dashboard';
            break;
        case '/doctor/profileDoctor':
            pageTitle = 'Profile';
            pageSubtitle = 'Manage your account settings and preferences';
            break;
        case '/doctor/ManageSupportGroup':
            pageTitle = 'Manage Support Group';
            pageSubtitle = 'Manage your support groups and members';
            break;
        case '/doctor/ViewListAppointment':
            pageTitle = 'View List of Appointment';
            pageSubtitle = 'View and manage your appointments';
            break;
        case '/doctor/manage-booking-schedule':
            pageTitle = 'Manage Booking Schedule';
            pageSubtitle = 'Manage your booking schedule and availability';
            break;
        case '/doctor/therapy-sessions':
            pageTitle = 'Manage Therapy Sessions';
            pageSubtitle = 'Create and manage your sessions';
            break;
        case '/doctor/ManageAboutPatient':
            pageTitle = 'Manage About Patient';
            pageSubtitle = 'View and manage patient information';
            break;
        case '/doctor/ManageContent':
            pageTitle = 'Manage Content';
            pageSubtitle = 'Manage your content and resources';
            break;
        case '/doctor/room/create':
            pageTitle = 'Create Room';
            pageSubtitle = 'Create a new video consultation room';
            break;
        case '/doctor/room/join':
            pageTitle = 'Join Room';
            pageSubtitle = 'Join an existing video consultation room';
            break;
        case '/doctor/room/list':
            pageTitle = 'Room List';
            pageSubtitle = 'View all available video consultation rooms';
            break;
        default:
            pageTitle = 'Page';
            pageSubtitle = 'Page description';
    }

    return (
        <div className="doctor-navbar">
            <div className="doctor-logo">Better Together</div>
            <div className="page-info">
                <h1 className="doctor-page-title">{pageTitle}</h1>
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

