import React from "react";
import { useLocation } from "react-router-dom";
import './NavBarAdmin.css';

export default function Navbar() {
    const location = useLocation();
    let pageTitle = '';

    switch (location.pathname) {
        case '/admin/dashboard':
            pageTitle = 'Dashboard';
            break;
        case '/admin/manage-domains':
            pageTitle = 'Manage Domains';
            break;
        case '/admin/profile':
            pageTitle = 'Profile';
            break;
        case '/admin/manage-doctors':
            pageTitle = 'Manage Doctors';
            break;
        case '/admin/manage-tests':
            pageTitle = 'Manage Tests';
                break;
        case '/admin/manage-questions':
            pageTitle = 'Manage Questions';
                break;
        default:
            pageTitle = 'Page';
    }

    return (
        <div className="admin-navbar">
            <div className="admin-logo">Better Together</div>
            <div className="admin-page-title">{pageTitle}</div>
        </div>
    );
}

