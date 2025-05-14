import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "../NavBarAdmin";

export default function ManageDoctors() {
    return (
        <div>
            <Navbar />
            <Sidebar />
            <h1>Manage Doctors</h1>
            <p>This is the Manage Doctors page.</p>
        </div>
    );
}
