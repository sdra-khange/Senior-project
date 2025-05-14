import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./NavBarAdmin";


export default function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <Navbar />
            <Sidebar />
            <div className="content">
                {/* هنا رح يكون عرض المحتوى المختلف */}
                <h1>Welcome to Admin Dashboard</h1>
            </div>
        </div>
    );
}
