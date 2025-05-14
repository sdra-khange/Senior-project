import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';
import './ManageBookingSchedule.css'; // Import CSS for styling

function ManageBookingSchedule() {
  return (
    <div className="manage-booking-schedule">
      <Navbar />
      <SidebarDoctor />
      <h2 className="manage-booking-title">Manage Booking Schedule</h2>
      <div className="manage-booking-cards-container">
        <div className="manage-booking-card">
          <Link to="/doctor/generate-sessions" className="manage-booking-link-button">Create Multiple Sessions</Link>
        </div>
        <div className="manage-booking-card">
          <Link to="/doctor/create-session" className="manage-booking-link-button">Create Single Session</Link>
        </div>
        <div className="manage-booking-card">
          <Link to="/doctor/ViewListAppointment" className="manage-booking-link-button">View Appointment List</Link>
        </div>
      </div>
    </div>
  );
}

export default ManageBookingSchedule;