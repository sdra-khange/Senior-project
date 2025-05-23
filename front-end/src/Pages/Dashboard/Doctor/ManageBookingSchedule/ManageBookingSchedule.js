// import React from 'react';
// import { Link } from 'react-router-dom';
// import Navbar from '../NavBardoctor';
// import SidebarDoctor from '../SidebarDoctor';
// import './ManageBookingSchedule.css'; // Import CSS for styling

// function ManageBookingSchedule() {
//   return (
//     <div className="manage-booking-schedule">
//       <Navbar />
//       <SidebarDoctor />
//       <h2 className="manage-booking-title">Manage Booking Schedule</h2>
//       <div className="manage-booking-cards-container">
//         <div className="manage-booking-card">
//           <Link to="/doctor/generate-sessions" className="manage-booking-link-button">Create Multiple Sessions</Link>
//         </div>
//         <div className="manage-booking-card">
//           <Link to="/doctor/create-session" className="manage-booking-link-button">Create Single Session</Link>
//         </div>
//         <div className="manage-booking-card">
//           <Link to="/doctor/ViewListAppointment" className="manage-booking-link-button">View Appointment List</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ManageBookingSchedule;

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';
import './ManageBookingSchedule.css';

function ManageBookingSchedule() {
  return (
    <div className="manage-booking-schedule">
      <SidebarDoctor />
      <Navbar />
      <div className="manage-booking-content">
        <h1 className="manage-booking-title">Manage Booking Schedule</h1>
        <p className="manage-booking-subtitle">Choose an option to manage your therapy sessions</p>
        
        <div className="manage-booking-cards-container">
          <div className="manage-booking-card">
            <h3>Generate Multiple Sessions</h3>
            <p>Create sessions in bulk for a date range</p>
            <Link to="/doctor/generate-sessions" className="manage-booking-link-button">
              Create Multiple
            </Link>
          </div>
          
          <div className="manage-booking-card">
            <h3>Create Single Session</h3>
            <p>Add a single therapy session</p>
            <Link to="/doctor/create-session" className="manage-booking-link-button">
              Create Single
            </Link>
          </div>
          
          <div className="manage-booking-card">
            <h3>View Appointments</h3>
            <p>Manage existing sessions</p>
            <Link to="/doctor/ViewListAppointment" className="manage-booking-link-button">
              View List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageBookingSchedule;