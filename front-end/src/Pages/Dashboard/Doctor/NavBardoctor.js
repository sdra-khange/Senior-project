import React from "react";
import { useLocation } from "react-router-dom";
import './NavBarDoctor.css';

export default function Navbar() {
    const location = useLocation();
    let pageTitle = '';

    switch (location.pathname) {
        case '/doctor/dashboardDoctor':
            pageTitle = 'Dashboard';
            break;
        case '/doctor/profileDoctor':
            pageTitle = 'Profile';
            break;
        case '/doctor/ManageSupportGroup':
            pageTitle = 'Manage Support Group';
            break;
        case '/doctor/ViewListAppointment':
            pageTitle = 'View List of Appointment';
            break;
        case '/doctor/manage-booking-schedule':
            pageTitle = 'Manage Booking Schedule';
            break;
            
        case '/doctor/generate-sessions':
            pageTitle = 'Generate Sessions';
            break;
            
        case '/doctor/create-session':
            pageTitle = 'Create Session';
            break;
        case '/doctor/ManageAboutPatient':
            pageTitle = 'Manage About Patient';
            break;
        case '/doctor/ManageContent':
            pageTitle = 'Manage Content';
            break;
        default:
            pageTitle = 'Page';
    }

    return (
        <div className="doctor-navbar">
            <div className="doctor-logo">Better Together</div>
            <div className="doctor-page-title">{pageTitle}</div>
        </div>
    );
}

