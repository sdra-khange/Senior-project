import React from "react";
import { useLocation } from "react-router-dom";
import './NavBarDoctor.css';

export default function Navbar() {
    const location = useLocation();
    let pageTitle = '';

    switch (location.pathname) {
        case '/patient/dashboardDoctor':
            pageTitle = 'Dashboard';
            break;
        case '/patient/profilePatient':
            pageTitle = 'Profile';
            break;
        case '/patient/ManageSupportGroup':
            pageTitle = 'Manage Support Group';
            break;
        case '/patient/ViewListAppointment':
            pageTitle = 'View List of Appointment';
            break;
        case '/patient/ManageBookingSchedule':
            pageTitle = 'Manage Booking Schedule';
            break;
        case '/patient/ManageAboutPatient':
            pageTitle = 'Manage About Patient';
            break;
        case '/patient/ManageContent':
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

