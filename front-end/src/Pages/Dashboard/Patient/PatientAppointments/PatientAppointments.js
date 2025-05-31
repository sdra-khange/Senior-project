import React, { useState, useEffect } from 'react';
import axiosTherapy from "../../../../utils/axiosTherapy";
import { FaUserMd, FaCalendarAlt, FaClock, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './PatientAppointments.css';
import SidebarPatient from '../SidebarPatient';
import NavbarPatient from '../NavBarPatient';

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Controls modal visibility
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null); // Stores selected appointment for cancellation
    const navigate = useNavigate();

    // Fetch appointments when the component mounts
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axiosTherapy.get('/patient/appointments/');
                setAppointments(response.data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    // Open confirmation modal for canceling an appointment
    const handleCancelAppointment = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setShowModal(true);
    };

    // Confirm and cancel the appointment
    const confirmCancelAppointment = async () => {
        try {
            await axiosTherapy.delete(`/patient/appointments/${selectedAppointmentId}/cancel/`);
            const response = await axiosTherapy.get('/patient/appointments/');
            setAppointments(response.data);
            setShowModal(false); // Close modal after successful cancellation
        } catch (error) {
            console.error("Error cancelling appointment:", error.response?.data || error);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Determine class for appointment status
    const getStatusClass = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'status-completed';
            case 'CANCELLED':
                return 'status-cancelled';
            default:
                return 'status-booked';
        }
    };

    return (
        <div className="appointments-container">
            <SidebarPatient />
            <NavbarPatient />

            <div className="appointments-header">
                <h1>My Appointments</h1>
                <p>View and manage your upcoming therapy sessions</p>
            </div>

            <div className="appointments-grid">
                {isLoading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading appointments...</p>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="no-appointments">
                        <FaInfoCircle size={48} style={{ marginBottom: '1rem', color: '#ddd' }} />
                        <h3>No appointments scheduled</h3>
                        <p>Book a session with a therapist to see it here</p>
                        <button 
                            className="reschedule-btn"
                            onClick={() => navigate('/patient/PatientDoctorsList')}
                        >
                            Find Therapists
                        </button>
                    </div>
                ) : (
                    appointments.map(appointment => (
                        <div key={appointment.id} className="appointment-card">
                            <div className="appointment-doctor">
                                <div className="doctor-avatar">
                                    {appointment.doctor.profile_photo ? (
                                        <img 
                                            src={`http://localhost:8000${appointment.doctor.profile_photo}`} 
                                            alt={appointment.doctor.username}
                                        />
                                    ) : (
                                        <FaUserMd size={24} />
                                    )}
                                </div>
                                <div className="doctor-info">
                                    <h3>Dr. {appointment.doctor.username}</h3>
                                    <p className="doctor-specialization">
                                        {appointment.doctor.specialization}
                                    </p>
                                </div>
                            </div>

                            <div className="appointment-details">
                                <div className="appointment-date">
                                    <FaCalendarAlt />
                                    <span>{formatDate(appointment.date)}</span>
                                </div>
                                <div className="appointment-time">
                                    <FaClock />
                                    <span>
                                        {appointment.start_time.slice(0,5)} - {appointment.end_time.slice(0,5)}
                                    </span>
                                </div>
                                <div className="appointment-type">
                                    {appointment.session_type === 'VIDEO' ? 'Video Session' : 
                                     appointment.session_type === 'VOICE' ? 'Voice Call' : 'Messaging'}
                                </div>
                                <div className={`appointment-status ${getStatusClass(appointment.real_status)}`}>
                                    {appointment.real_status.toLowerCase()}
                                </div>
                            </div>

                            {appointment.real_status === 'PENDING' && (
                                <div className="appointment-actions">
                                    <button 
                                        className="cancel-btn"
                                        onClick={() => handleCancelAppointment(appointment.id)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="reschedule-btn"
                                        onClick={() => navigate(`/patient/PatientDoctorsList/${appointment.doctor.id}`)}
                                    >
                                        Reschedule
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Custom Modal for appointment cancellation confirmation */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <p>Are you sure you want to cancel this appointment?</p>
                        <div className="modal-actions">
                            <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
                            <button className="confirm-btn" onClick={confirmCancelAppointment}>Cancel Appointment</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientAppointments;
