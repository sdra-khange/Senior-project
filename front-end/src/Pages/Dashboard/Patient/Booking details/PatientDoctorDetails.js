import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosTherapy from "../../../../utils/axiosTherapy";
import { FaUserMd, FaClock, FaMoneyBillWave, FaCalendarAlt, FaArrowLeft, FaBook } from 'react-icons/fa';
import './PatientDoctorDetails.css';
import SidebarPatient from '../SidebarPatient';
import NavbarPatient from '../NavBarPatient';

const PatientDoctorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorRes, sessionsRes] = await Promise.all([
                    axiosTherapy.get(`/doctors/${id}/`),
                    axiosTherapy.get(`/doctors/${id}/sessions/`)
                ]);
                
                setDoctor(doctorRes.data);
                setSessions(sessionsRes.data.filter(s => s.status === 'FREE'));
            } catch (error) {
                console.error("Error fetching data:", error);
                alert('Failed to load doctor details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, bookingSuccess]);

    // const handleBookSession = async (sessionId) => {
    //     try {
    //         await axiosTherapy.post('/sessions/book/', { session_id: sessionId });
    //         setBookingSuccess(true);
    //         alert('Session booked successfully!');
    //     } catch (error) {
    //         console.error("Booking error:", error);
    //         alert(error.response?.data?.message || 'Failed to book session.');
    //     }
    // };
    const handleBookSession = async (sessionId) => {
        try {
            await axiosTherapy.post('/sessions/book/', { session_id: sessionId });
            setBookingSuccess(true);
            alert('Session booked successfully! You can view it in "My Appointments"');
        } catch (error) {
            console.error("Booking error:", error);
            alert(error.response?.data?.message || 'Failed to book session.');
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading doctor details...</p>
            </div>
        );
    }

    if (!doctor) {
        return <div className="error-message">Doctor not found</div>;
    }

    return (
        <div className="doctor-details-container">
            <SidebarPatient />
            <NavbarPatient />
            <button className="back-button" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back to Doctors
            </button>

            <div className="doctor-header">
                <div className="doctor-image">
                    {doctor.profile_photo ? (
                        <img 
                            src={`http://localhost:8000${doctor.profile_photo}`} 
                            alt={doctor.username}
                        />
                    ) : (
                        <div className="default-avatar">
                            <FaUserMd />
                        </div>
                    )}
                </div>
                
                <div className="doctor-main-info">
                    <h1>Dr. {doctor.username}</h1>
                    <p className="specialization">{doctor.specialization}</p>
                    <div className="doctor-stats">
                        <div className="stat-item">
                            <FaClock />
                            <span>{doctor.session_duration} minute sessions</span>
                        </div>
                        <div className="stat-item">
                            <FaMoneyBillWave />
                            <span>${doctor.session_price} per session</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sessions-section">
                <h2>Available Sessions</h2>
                
                {sessions.length === 0 ? (
                    <div className="no-sessions">
                        <p>No available sessions at this time.</p>
                        <p>Please check back later or contact the doctor directly.</p>
                    </div>
                ) : (
                    <div className="sessions-grid">
                        {sessions.map(session => (
                            <div key={session.id} className="session-card">
                                <div className="session-date">
                                    <FaCalendarAlt />
                                    <span>
                                        {new Date(session.date).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="session-time">
                                    <FaClock />
                                    <span>
                                        {session.start_time.slice(0,5)} - {session.end_time.slice(0,5)}
                                    </span>
                                </div>
                                <div className="session-type">
                                    {session.session_type === 'VIDEO' ? 'Video Session' : 
                                     session.session_type === 'VOICE' ? 'Voice Call' : 'Messaging'}
                                </div>
                                <button
                                    className="book-button"
                                    onClick={() => handleBookSession(session.id)}
                                >
                                    <FaBook /> Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDoctorDetails;