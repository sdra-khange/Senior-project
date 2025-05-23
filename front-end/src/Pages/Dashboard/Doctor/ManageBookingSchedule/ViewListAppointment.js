// import React, { useEffect, useState } from 'react';
// import axios from '../../../../utils/axiosProfile';
// import './ViewListAppointment.css'; 
// import Navbar from '../NavBardoctor';
// import SidebarDoctor from '../SidebarDoctor';


// const ViewListAppointment = () => {
//     const [sessions, setSessions] = useState([]);
//     const [message, setMessage] = useState('');

//     // Fetch available sessions
//     const fetchSessions = async () => {
//         try {
//             const response = await axios.get('/app/sessions/');
//             setSessions(response.data);
//         } catch (error) {
//             console.error('Error fetching sessions:', error);
//         }
//     };

//     useEffect(() => {
//         fetchSessions();
//     }, []);

//     // Delete session
//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`/app/sessions/${id}/`);
//             setMessage('Session deleted successfully.');
//             fetchSessions();
//         } catch (error) {
//             console.error('Error deleting session:', error);
//             setMessage('Error deleting session.');
//         }
//     };

//     return (
//         <div className="view-list-appointment-container">
//             <SidebarDoctor />
//             <Navbar />
//             <h1>View List Appointment</h1>
//             {message && <p className="message">{message}</p>}
//             <table className="session-table">
//                 <thead>
//                     <tr>
//                         <th>Date</th>
//                         <th>Start Time</th>
//                         <th>End Time</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {sessions.map((session) => (
//                         <tr key={session.id}>
//                             <td>{session.date}</td>
//                             <td>{session.start_time}</td>
//                             <td>{session.end_time}</td>
//                             <td>{session.status}</td>
//                             <td className="session-actions">
//                                 <button className="delete-button" onClick={() => handleDelete(session.id)}>
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default ViewListAppointment;

import React, { useEffect, useState, useCallback } from 'react';
import axios from '../../../../utils/axiosProfile';
import './ViewListAppointment.css';
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';
import Cookie from 'cookie-universal';
import { FaSearch, FaCalendarAlt, FaClock, FaVideo, FaPhone, FaComment, FaEdit, FaTrash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const ViewListAppointment = () => {
    const [sessions, setSessions] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [doctorId, setDoctorId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentSession, setCurrentSession] = useState(null);
    const cookies = Cookie();

    useEffect(() => {
        const userData = cookies.get('user-data');
        if (userData?.id) setDoctorId(userData.id);
    }, [cookies]);

    const fetchSessions = useCallback(async () => {
        if (!doctorId) return;
        
        setIsLoading(true);
        setMessage('');
        try {
            let url = `/app/sessions/?doctor=${doctorId}`;
            if (searchQuery) url += `&search=${searchQuery}`;
            if (statusFilter !== 'All') url += `&status=${statusFilter}`;
            
            const response = await axios.get(url);
            setSessions(response.data);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            setMessage(error.response?.data?.message || 'Failed to load sessions');
        } finally {
            setIsLoading(false);
        }
    }, [doctorId, searchQuery, statusFilter]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleEditClick = (session) => {
        setCurrentSession(session);
        setShowEditModal(true);
    };

    const handleDeleteClick = (session) => {
        setCurrentSession(session);
        setShowDeleteModal(true);
    };

    const handleUpdateSession = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.put(`/app/sessions/${currentSession.id}/`, currentSession);
            setMessage('Session updated successfully');
            fetchSessions();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating session:', error);
            setMessage(error.response?.data?.message || 'Failed to update session');
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`/app/sessions/${currentSession.id}/`);
            setMessage('Session deleted successfully');
            fetchSessions();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting session:', error);
            setMessage(error.response?.data?.message || 'Failed to delete session');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        return timeString?.slice(0, 5) || '';
    };

    const getStatusClass = (status) => {
        switch (status?.toUpperCase()) {
            case 'BOOKED': return 'doctor-session-booked';
            case 'FREE': return 'doctor-session-available';
            case 'COMPLETED': return 'doctor-session-completed';
            case 'CANCELLED': return 'doctor-session-cancelled';
            default: return '';
        }
    };

    const getSessionTypeIcon = (type) => {
        switch (type?.toUpperCase()) {
            case 'VIDEO': 
                return <FaVideo className="doctor-session-type-icon" style={{ color: '#6c5ce7' }} />;
            case 'VOICE': 
                return <FaPhone className="doctor-session-type-icon" style={{ color: '#6c5ce7' }} />;
            case 'MESSAGE': 
                return <FaComment className="doctor-session-type-icon" style={{ color: '#6c5ce7' }} />;
            default: 
                return null;
        }
    };

    const getSessionTypeText = (type) => {
        switch (type?.toUpperCase()) {
            case 'VIDEO': return 'Video Call';
            case 'VOICE': return 'Voice Call';
            case 'MESSAGE': return 'Messages';
            default: return type;
        }
    };

    return (
        <div className="doctor-sessions-container">
            <SidebarDoctor />
            <Navbar />
            
            <div className="doctor-sessions-content">
                <div className="doctor-sessions-header">
                    <div>
                        <h1>Manage Sessions</h1>
                        <p>View and manage your therapy sessions</p>
                    </div>
                </div>

                {message && (
                    <div className={`doctor-sessions-message ${
                        message.includes('Failed') ? 'doctor-sessions-error' : 'doctor-sessions-success'
                    }`}>
                        {message}
                    </div>
                )}

                <div className="doctor-sessions-filters">
                    <div className="doctor-sessions-search">
                        <FaSearch className="doctor-sessions-search-icon" />
                        <input
                            type="text"
                            placeholder="Search sessions..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="doctor-sessions-filter-options">
                        <select value={statusFilter} onChange={handleStatusFilterChange}>
                            <option value="All">All Statuses</option>
                            <option value="FREE">Available</option>
                            <option value="BOOKED">Booked</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="doctor-sessions-loading">
                        <div className="doctor-sessions-spinner"></div>
                    </div>
                ) : sessions.length > 0 ? (
                    <div className="doctor-sessions-table-container">
                        <table className="doctor-sessions-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Patient</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((session) => (
                                    <tr key={session.id}>
                                        <td>
                                            <div className="doctor-sessions-date">
                                                <FaCalendarAlt style={{ marginRight: '8px', color: '#6c5ce7' }} />
                                                {formatDate(session.date)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="doctor-sessions-time">
                                                <FaClock style={{ marginRight: '8px', color: '#6c5ce7' }} />
                                                {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="doctor-sessions-type">
                                                {getSessionTypeIcon(session.session_type)}
                                                <span style={{ marginLeft: '8px' }}>
                                                    {getSessionTypeText(session.session_type)}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`doctor-session-status ${getStatusClass(session.status)}`}>
                                                {session.status}
                                            </span>
                                        </td>
                                        <td>
                                            {session.patient_name || 'N/A'}
                                        </td>
                                        <td>
                                            <div className="doctor-session-actions">
                                                <button 
                                                    className="doctor-session-action-btn edit"
                                                    onClick={() => handleEditClick(session)}
                                                    disabled={session.status !== 'FREE'}
                                                    title={session.status !== 'FREE' ? 
                                                        "Cannot edit booked/completed sessions" : ""}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button 
                                                    className="doctor-session-action-btn delete"
                                                    onClick={() => handleDeleteClick(session)}
                                                    disabled={session.status !== 'FREE'}
                                                    title={session.status !== 'FREE' ? 
                                                        "Cannot delete booked/completed sessions" : ""}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="doctor-sessions-empty">
                        <p>No sessions found</p>
                    </div>
                )}

                {/* Edit Session Modal */}
                {showEditModal && currentSession && (
                    <div className="doctor-sessions-modal-overlay">
                        <div className="doctor-sessions-modal">
                            <div className="doctor-sessions-modal-header">
                                <h2 className="doctor-sessions-modal-title">Edit Session</h2>
                                <button 
                                    className="doctor-sessions-modal-close"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    <IoClose />
                                </button>
                            </div>
                            <div className="doctor-sessions-modal-content">
                                <form onSubmit={handleUpdateSession}>
                                    <div className="doctor-sessions-form-group">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            value={currentSession.date}
                                            onChange={(e) => setCurrentSession({
                                                ...currentSession,
                                                date: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="doctor-sessions-form-group">
                                        <label>Start Time</label>
                                        <input
                                            type="time"
                                            value={currentSession.start_time}
                                            onChange={(e) => setCurrentSession({
                                                ...currentSession,
                                                start_time: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="doctor-sessions-form-group">
                                        <label>End Time</label>
                                        <input
                                            type="time"
                                            value={currentSession.end_time}
                                            onChange={(e) => setCurrentSession({
                                                ...currentSession,
                                                end_time: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="doctor-sessions-form-group">
                                        <label>Session Type</label>
                                        <select
                                            value={currentSession.session_type}
                                            onChange={(e) => setCurrentSession({
                                                ...currentSession,
                                                session_type: e.target.value
                                            })}
                                        >
                                            <option value="VIDEO">Video Call</option>
                                            <option value="VOICE">Voice Call</option>
                                            <option value="MESSAGE">Messages</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div className="doctor-sessions-modal-footer">
                                <button 
                                    className="doctor-sessions-modal-btn cancel"
                                    onClick={() => setShowEditModal(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="doctor-sessions-modal-btn save"
                                    onClick={handleUpdateSession}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && currentSession && (
                    <div className="doctor-sessions-modal-overlay">
                        <div className="doctor-sessions-modal">
                            <div className="doctor-sessions-modal-header">
                                <h2 className="doctor-sessions-modal-title">Delete Session</h2>
                                <button 
                                    className="doctor-sessions-modal-close"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    <IoClose />
                                </button>
                            </div>
                            <div className="doctor-sessions-modal-content">
                                <p>Are you sure you want to delete this session?</p>
                                <p><strong>Date:</strong> {formatDate(currentSession.date)}</p>
                                <p><strong>Time:</strong> {formatTime(currentSession.start_time)} - {formatTime(currentSession.end_time)}</p>
                                <p><strong>Type:</strong> {getSessionTypeText(currentSession.session_type)}</p>
                            </div>
                            <div className="doctor-sessions-modal-footer">
                                <button 
                                    className="doctor-sessions-modal-btn cancel"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="doctor-sessions-modal-btn delete"
                                    onClick={confirmDelete}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewListAppointment;