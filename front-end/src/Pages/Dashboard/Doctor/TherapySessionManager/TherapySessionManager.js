// import React, { useState, useEffect, useCallback } from 'react';
// import axios from '../../../../utils/axiosProfile';
// import Cookie from 'cookie-universal';
// import { FaSearch, FaCalendarAlt, FaClock, FaVideo, FaPhone, FaComment, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
// import './TherapySessionManager.css';
// import Navbar from '../NavBardoctor';
// import SidebarDoctor from '../SidebarDoctor';

// const TherapySessionManager = () => {
//     const cookies = Cookie();
//     const [activeTab, setActiveTab] = useState('view');
//     const [sessions, setSessions] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const [doctorId, setDoctorId] = useState('');
    
//     // Single session form state
//     const [singleDate, setSingleDate] = useState('');
//     const [singleStartTime, setSingleStartTime] = useState('');
//     const [singleEndTime, setSingleEndTime] = useState('');
//     const [singleSessionType, setSingleSessionType] = useState('VIDEO');
    
//     // Multiple sessions form state
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [startTime, setStartTime] = useState('');
//     const [endTime, setEndTime] = useState('');
//     const [sessionTypes, setSessionTypes] = useState(['VIDEO']);
    
//     // View sessions state
//     const [searchQuery, setSearchQuery] = useState('');
//     const [statusFilter, setStatusFilter] = useState('All');
//     const [currentSession, setCurrentSession] = useState(null);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [showConfirmModal, setShowConfirmModal] = useState(false);
//     const [confirmAction, setConfirmAction] = useState(null);

//     useEffect(() => {
//         const userData = cookies.get('user-data');
//         if (userData?.id) setDoctorId(userData.id);
//     }, [cookies]);

//     const fetchSessions = useCallback(async () => {
//         if (!doctorId) return;
        
//         setIsLoading(true);
//         setMessage('');
//         try {
//             let url = `/app/sessions/?doctor=${doctorId}&expand=patient_details`;
//             if (searchQuery) url += `&search=${searchQuery}`;
//             if (statusFilter !== 'All') url += `&status=${statusFilter}`;
            
//             const response = await axios.get(url);
            
//             const processedSessions = response.data.map(session => ({
//                 ...session,
//                 patient_name: session.patient_details 
//                     ? `${session.patient_details.first_name || ''} ${session.patient_details.last_name || ''}`.trim()
//                     : null,
//                 patient_details: session.patient_details || null
//             }));
            
//             setSessions(processedSessions);
//         } catch (error) {
//             console.error('Error fetching sessions:', error);
//             setMessage(error.response?.data?.message || 'Failed to load sessions');
//         } finally {
//             setIsLoading(false);
//         }
//     }, [doctorId, searchQuery, statusFilter]);

//     useEffect(() => {
//         if (activeTab === 'view') {
//             fetchSessions();
//         }
//     }, [activeTab, fetchSessions]);

//     const handleCreateSingleSession = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setMessage('');
        
//         if (!singleDate || !singleStartTime || !singleEndTime) {
//             setMessage('Error: All fields are required');
//             setIsLoading(false);
//             return;
//         }

//         if (new Date(`${singleDate}T${singleStartTime}`) >= new Date(`${singleDate}T${singleEndTime}`)) {
//             setMessage('Error: End time must be after start time');
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const response = await axios.post('/app/sessions/', {
//                 doctor: doctorId,
//                 date: singleDate,
//                 start_time: singleStartTime,
//                 end_time: singleEndTime,
//                 session_type: singleSessionType,
//                 status: 'FREE',
//             });

//             if (response.status === 201) {
//                 setMessage('Session created successfully!');
//                 setSingleDate('');
//                 setSingleStartTime('');
//                 setSingleEndTime('');
//                 fetchSessions();
//             }
//         } catch (error) {
//             console.error('Error creating session:', error);
//             const errorMsg = error.response?.data?.message || 
//                             error.response?.data?.detail || 
//                             error.message || 
//                             'Failed to create session';
//             setMessage(`Error: ${errorMsg}`);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const toggleSessionType = (type) => {
//         setSessionTypes(prev => 
//             prev.includes(type) 
//                 ? prev.filter(t => t !== type)
//                 : [...prev, type]
//         );
//     };

//     const handleGenerateMultipleSessions = async (e) => {
//         e.preventDefault();
//         if (!doctorId) {
//             setMessage('Error: Doctor ID is missing');
//             return;
//         }

//         setIsLoading(true);
//         try {
//             await axios.post('/app/sessions/generate/', {
//                 doctor: doctorId,
//                 start_date: startDate,
//                 end_date: endDate,
//                 start_time: startTime,
//                 end_time: endTime,
//                 session_types: sessionTypes,
//             });
//             setMessage('Sessions generated successfully!');
//             setStartDate('');
//             setEndDate('');
//             setStartTime('');
//             setEndTime('');
//             fetchSessions();
//         } catch (error) {
//             setMessage(error.response?.data?.message || 'Failed to generate sessions');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleEditClick = (session) => {
//         if (session.status === 'BOOKED') {
//             setCurrentSession(session);
//             setConfirmAction('edit');
//             setShowConfirmModal(true);
//         } else {
//             setCurrentSession(session);
//             setShowEditModal(true);
//         }
//     };

//     const handleDeleteClick = (session) => {
//         setCurrentSession(session);
//         setConfirmAction('delete');
//         setShowConfirmModal(true);
//     };

//     const confirmActionHandler = () => {
//         setShowConfirmModal(false);
//         if (confirmAction === 'edit') {
//             setShowEditModal(true);
//         } else if (confirmAction === 'delete') {
//             setShowDeleteModal(true);
//         }
//     };

//     const handleUpdateSession = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         try {
//             await axios.put(`/app/sessions/${currentSession.id}/`, currentSession);
//             setMessage('Session updated successfully');
//             fetchSessions();
//             setShowEditModal(false);
//         } catch (error) {
//             console.error('Error updating session:', error);
//             setMessage(error.response?.data?.message || 'Failed to update session');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const confirmDelete = async () => {
//         setIsLoading(true);
//         try {
//             await axios.delete(`/app/sessions/${currentSession.id}/`);
//             setMessage('Session deleted successfully');
//             fetchSessions();
//             setShowDeleteModal(false);
//         } catch (error) {
//             console.error('Error deleting session:', error);
//             setMessage(error.response?.data?.message || 'Failed to delete session');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const formatDate = (dateString) => {
//         const options = { year: 'numeric', month: 'short', day: 'numeric' };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     const formatTime = (timeString) => {
//         return timeString?.slice(0, 5) || '';
//     };

//     const getStatusClass = (status) => {
//         switch (status?.toUpperCase()) {
//             case 'BOOKED': return 'session-booked';
//             case 'FREE': return 'session-available';
//             case 'COMPLETED': return 'session-completed';
//             case 'CANCELLED': return 'session-cancelled';
//             default: return '';
//         }
//     };

//     const getSessionTypeIcon = (type) => {
//         switch (type?.toUpperCase()) {
//             case 'VIDEO': return <FaVideo className="session-type-icon" />;
//             case 'VOICE': return <FaPhone className="session-type-icon" />;
//             case 'MESSAGE': return <FaComment className="session-type-icon" />;
//             default: return null;
//         }
//     };

//     const getSessionTypeText = (type) => {
//         switch (type?.toUpperCase()) {
//             case 'VIDEO': return 'Video Call';
//             case 'VOICE': return 'Voice Call';
//             case 'MESSAGE': return 'Messages';
//             default: return type;
//         }
//     };

//     const getPatientDisplay = (session) => {
//         if (session.status !== 'BOOKED' && session.status !== 'COMPLETED') return 'N/A';
//         return session.patient_name || session.patient_details?.username || 'N/A';
//     };

//     return (
//         <div className="therapy-session-manager">
//             <SidebarDoctor />
//             <Navbar />
//             <div className="therapy-session-header">
//                 <h1>Therapy Session Manager</h1>
//                 <p>Streamline your therapy practice with our intuitive scheduling system</p>
//             </div>

//             <div className="therapy-session-tabs">
//                 <button 
//                     className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
//                     onClick={() => setActiveTab('single')}
//                 >
//                     <FaPlus /> Create Single Session
//                 </button>
//                 <button 
//                     className={`tab-btn ${activeTab === 'multiple' ? 'active' : ''}`}
//                     onClick={() => setActiveTab('multiple')}
//                 >
//                     <FaPlus /> Generate Multiple Sessions
//                 </button>
//                 <button 
//                     className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
//                     onClick={() => setActiveTab('view')}
//                 >
//                     View Appointments
//                 </button>
//             </div>

//             {message && (
//                 <div className={`therapy-session-message ${
//                     message.includes('Error') || message.includes('Failed') ? 'error' : 'success'
//                 }`}>
//                     {message}
//                 </div>
//             )}

//             {activeTab === 'single' && (
//                 <div className="therapy-session-form">
//                     <h2>Create a New Session</h2>
//                     <p className="form-subtitle">Fill in the details below to schedule a single therapy session.</p>
                    
//                     <form onSubmit={handleCreateSingleSession}>
//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label>Date</label>
//                                 <input
//                                     type="date"
//                                     value={singleDate}
//                                     onChange={(e) => setSingleDate(e.target.value)}
//                                     required
//                                     min={new Date().toISOString().split('T')[0]}
//                                 />
//                             </div>
//                         </div>

//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label>Start Time</label>
//                                 <input
//                                     type="time"
//                                     value={singleStartTime}
//                                     onChange={(e) => setSingleStartTime(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label>End Time</label>
//                                 <input
//                                     type="time"
//                                     value={singleEndTime}
//                                     onChange={(e) => setSingleEndTime(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         <div className="form-group">
//                             <label>Session Type</label>
//                             <div className="session-type-options">
//                                 <label className="session-type-option">
//                                     <input
//                                         type="radio"
//                                         name="singleSessionType"
//                                         value="VIDEO"
//                                         checked={singleSessionType === 'VIDEO'}
//                                         onChange={() => setSingleSessionType('VIDEO')}
//                                     />
//                                     <div className="option-content">
//                                         <h4>Video Call</h4>
//                                         <p>Face-to-face virtual session</p>
//                                     </div>
//                                 </label>
//                                 <label className="session-type-option">
//                                     <input
//                                         type="radio"
//                                         name="singleSessionType"
//                                         value="VOICE"
//                                         checked={singleSessionType === 'VOICE'}
//                                         onChange={() => setSingleSessionType('VOICE')}
//                                     />
//                                     <div className="option-content">
//                                         <h4>Voice Call</h4>
//                                         <p>Audio-only therapy session</p>
//                                     </div>
//                                 </label>
//                                 <label className="session-type-option">
//                                     <input
//                                         type="radio"
//                                         name="singleSessionType"
//                                         value="MESSAGE"
//                                         checked={singleSessionType === 'MESSAGE'}
//                                         onChange={() => setSingleSessionType('MESSAGE')}
//                                     />
//                                     <div className="option-content">
//                                         <h4>Messages</h4>
//                                         <p>Text-based communication</p>
//                                     </div>
//                                 </label>
//                             </div>
//                         </div>

//                         <button type="submit" className="submit-btn" disabled={isLoading}>
//                             {isLoading ? 'Creating...' : 'Create Session'}
//                         </button>
//                     </form>
//                 </div>
//             )}

//             {activeTab === 'multiple' && (
//                 <div className="therapy-session-form">
//                     <h2>Generate Multiple Sessions</h2>
//                     <p className="form-subtitle">Create a series of therapy sessions within a date range</p>
                    
//                     <form onSubmit={handleGenerateMultipleSessions}>
//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label>Start Date</label>
//                                 <input
//                                     type="date"
//                                     value={startDate}
//                                     onChange={(e) => setStartDate(e.target.value)}
//                                     required
//                                     min={new Date().toISOString().split('T')[0]}
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label>End Date</label>
//                                 <input
//                                     type="date"
//                                     value={endDate}
//                                     onChange={(e) => setEndDate(e.target.value)}
//                                     required
//                                     min={startDate || new Date().toISOString().split('T')[0]}
//                                 />
//                             </div>
//                         </div>

//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label>Start Time</label>
//                                 <input
//                                     type="time"
//                                     value={startTime}
//                                     onChange={(e) => setStartTime(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label>End Time</label>
//                                 <input
//                                     type="time"
//                                     value={endTime}
//                                     onChange={(e) => setEndTime(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         <div className="form-group">
//                             <label>Session Types</label>
//                             <div className="session-type-options multiple">
//                                 <label className="session-type-option">
//                                     <input
//                                         type="checkbox"
//                                         checked={sessionTypes.includes('VIDEO')}
//                                         onChange={() => toggleSessionType('VIDEO')}
//                                     />
//                                     <div className="option-content">
//                                         <h4>Video Call</h4>
//                                         <p>Face-to-face virtual session</p>
//                                     </div>
//                                 </label>
//                                 <label className="session-type-option">
//                                     <input
//                                         type="checkbox"
//                                         checked={sessionTypes.includes('VOICE')}
//                                         onChange={() => toggleSessionType('VOICE')}
//                                     />
//                                     <div className="option-content">
//                                         <h4>Voice Call</h4>
//                                         <p>Audio-only therapy session</p>
//                                     </div>
//                                 </label>
//                                 <label className="session-type-option">
//                                     <input
//                                         type="checkbox"
//                                         checked={sessionTypes.includes('MESSAGE')}
//                                         onChange={() => toggleSessionType('MESSAGE')}
//                                     />
//                                     <div className="option-content">
//                                         <h4>Messages</h4>
//                                         <p>Text-based communication</p>
//                                     </div>
//                                 </label>
//                             </div>
//                         </div>

//                         <button type="submit" className="submit-btn" disabled={isLoading}>
//                             {isLoading ? 'Generating...' : 'Generate Sessions'}
//                         </button>
//                     </form>
//                 </div>
//             )}

//             {activeTab === 'view' && (
//                 <div className="therapy-session-view">
//                     <div className="view-filters">
//                         <div className="search-box">
//                             <FaSearch className="search-icon" />
//                             <input
//                                 type="text"
//                                 placeholder="Search sessions..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                             />
//                         </div>
//                         <select 
//                             value={statusFilter} 
//                             onChange={(e) => setStatusFilter(e.target.value)}
//                             className="status-filter"
//                         >
//                             <option value="All">All Statuses</option>
//                             <option value="FREE">Available</option>
//                             <option value="BOOKED">Booked</option>
//                             <option value="COMPLETED">Completed</option>
//                             <option value="CANCELLED">Cancelled</option>
//                         </select>
//                     </div>

//                     {isLoading ? (
//                         <div className="loading-spinner">
//                             <div className="spinner"></div>
//                         </div>
//                     ) : sessions.length > 0 ? (
//                         <div className="sessions-table">
//                             <table>
//                                 <thead>
//                                     <tr>
//                                         <th>Date</th>
//                                         <th>Time</th>
//                                         <th>Type</th>
//                                         <th>Status</th>
//                                         <th>Patient</th>
//                                         <th>Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {sessions.map((session) => (
//                                         <tr key={session.id}>
//                                             <td>
//                                                 <div className="session-date">
//                                                     <FaCalendarAlt />
//                                                     {formatDate(session.date)}
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <div className="session-time">
//                                                     <FaClock />
//                                                     {formatTime(session.start_time)} - {formatTime(session.end_time)}
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <div className="session-type">
//                                                     {getSessionTypeIcon(session.session_type)}
//                                                     {getSessionTypeText(session.session_type)}
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <span className={`session-status ${getStatusClass(session.status)}`}>
//                                                     {session.status}
//                                                 </span>
//                                             </td>
//                                             <td>
//                                                 {getPatientDisplay(session)}
//                                             </td>
//                                             <td>
//                                                 <div className="session-actions">
//                                                     <button 
//                                                         className="action-btn edit"
//                                                         onClick={() => handleEditClick(session)}
//                                                         disabled={session.status === 'COMPLETED' || session.status === 'CANCELLED'}
//                                                         title={session.status === 'COMPLETED' || session.status === 'CANCELLED' ? 
//                                                             "Cannot edit completed/cancelled sessions" : ""}
//                                                     >
//                                                         <FaEdit />
//                                                     </button>
//                                                     <button 
//                                                         className="action-btn delete"
//                                                         onClick={() => handleDeleteClick(session)}
//                                                         disabled={session.status === 'COMPLETED'}
//                                                         title={session.status === 'COMPLETED' ? 
//                                                             "Cannot delete completed sessions" : ""}
//                                                     >
//                                                         <FaTrash />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <div className="no-sessions">
//                             <p>No sessions found</p>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Edit Session Modal */}
//             {showEditModal && currentSession && (
//                 <div className="modal-overlay">
//                     <div className="modal">
//                         <div className="modal-header">
//                             <h3>Edit Session</h3>
//                             <button 
//                                 className="modal-close"
//                                 onClick={() => setShowEditModal(false)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>
//                         <div className="modal-content">
//                             <form onSubmit={handleUpdateSession}>
//                                 <div className="form-group">
//                                     <label>Date</label>
//                                     <input
//                                         type="date"
//                                         value={currentSession.date}
//                                         onChange={(e) => setCurrentSession({
//                                             ...currentSession,
//                                             date: e.target.value
//                                         })}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-row">
//                                     <div className="form-group">
//                                         <label>Start Time</label>
//                                         <input
//                                             type="time"
//                                             value={currentSession.start_time}
//                                             onChange={(e) => setCurrentSession({
//                                                 ...currentSession,
//                                                 start_time: e.target.value
//                                             })}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>End Time</label>
//                                         <input
//                                             type="time"
//                                             value={currentSession.end_time}
//                                             onChange={(e) => setCurrentSession({
//                                                 ...currentSession,
//                                                 end_time: e.target.value
//                                             })}
//                                             required
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Session Type</label>
//                                     <select
//                                         value={currentSession.session_type}
//                                         onChange={(e) => setCurrentSession({
//                                             ...currentSession,
//                                             session_type: e.target.value
//                                         })}
//                                     >
//                                         <option value="VIDEO">Video Call</option>
//                                         <option value="VOICE">Voice Call</option>
//                                         <option value="MESSAGE">Messages</option>
//                                     </select>
//                                 </div>
//                             </form>
//                         </div>
//                         <div className="modal-footer">
//                             <button 
//                                 className="modal-btn cancel"
//                                 onClick={() => setShowEditModal(false)}
//                                 disabled={isLoading}
//                             >
//                                 Cancel
//                             </button>
//                             <button 
//                                 className="modal-btn save"
//                                 onClick={handleUpdateSession}
//                                 disabled={isLoading}
//                             >
//                                 {isLoading ? 'Saving...' : 'Save Changes'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Session Modal */}
//             {showDeleteModal && currentSession && (
//                 <div className="modal-overlay">
//                     <div className="modal">
//                         <div className="modal-header">
//                             <h3>Delete Session</h3>
//                             <button 
//                                 className="modal-close"
//                                 onClick={() => setShowDeleteModal(false)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>
//                         <div className="modal-content">
//                             <p>Are you sure you want to delete this session?</p>
//                             <div className="session-details">
//                                 <p><strong>Date:</strong> {formatDate(currentSession.date)}</p>
//                                 <p><strong>Time:</strong> {formatTime(currentSession.start_time)} - {formatTime(currentSession.end_time)}</p>
//                                 <p><strong>Type:</strong> {getSessionTypeText(currentSession.session_type)}</p>
//                                 <p><strong>Status:</strong> <span className={getStatusClass(currentSession.status)}>{currentSession.status}</span></p>
//                                 {(currentSession.status === 'BOOKED' || currentSession.status === 'COMPLETED') && (
//                                     <p><strong>Patient:</strong> {getPatientDisplay(currentSession)}</p>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="modal-footer">
//                             <button 
//                                 className="modal-btn cancel"
//                                 onClick={() => setShowDeleteModal(false)}
//                                 disabled={isLoading}
//                             >
//                                 Cancel
//                             </button>
//                             <button 
//                                 className="modal-btn delete"
//                                 onClick={confirmDelete}
//                                 disabled={isLoading}
//                             >
//                                 {isLoading ? 'Deleting...' : 'Delete'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Confirmation Modal */}
//             {showConfirmModal && (
//                 <div className="modal-overlay">
//                     <div className="modal small-modal">
//                         <div className="modal-header">
//                             <h3>Confirmation Required</h3>
//                             <button 
//                                 className="modal-close"
//                                 onClick={() => setShowConfirmModal(false)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>
//                         <div className="modal-content">
//                             {confirmAction === 'edit' && (
//                                 <p>This session is booked. The patient will be notified about changes. Are you sure you want to proceed?</p>
//                             )}
//                             {confirmAction === 'delete' && (
//                                 <p>Are you sure you want to delete this session? {currentSession?.status === 'BOOKED' && 'The patient will be notified.'}</p>
//                             )}
//                         </div>
//                         <div className="modal-footer">
//                             <button 
//                                 className="modal-btn cancel"
//                                 onClick={() => setShowConfirmModal(false)}
//                             >
//                                 Cancel
//                             </button>
//                             <button 
//                                 className="modal-btn confirm"
//                                 onClick={confirmActionHandler}
//                             >
//                                 Confirm
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TherapySessionManager;
import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../../../utils/axiosProfile';
import Cookie from 'cookie-universal';
import { FaSearch, FaCalendarAlt, FaClock, FaVideo, FaPhone, FaComment, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import './TherapySessionManager.css';
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';

const TherapySessionManager = () => {
    const cookies = Cookie();
    const [activeTab, setActiveTab] = useState('view');
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [doctorId, setDoctorId] = useState('');
    
    // Single session form state
    const [singleDate, setSingleDate] = useState('');
    const [singleStartTime, setSingleStartTime] = useState('');
    const [singleEndTime, setSingleEndTime] = useState('');
    const [singleSessionType, setSingleSessionType] = useState('VIDEO');
    
    // Multiple sessions form state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [sessionTypes, setSessionTypes] = useState(['VIDEO']);
    
    // View sessions state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentSession, setCurrentSession] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        const userData = cookies.get('user-data');
        if (userData?.id) setDoctorId(userData.id);
    }, [cookies]);

    const fetchSessions = useCallback(async () => {
        if (!doctorId) return;
        
        setIsLoading(true);
        setMessage('');
        try {
            let url = `/app/sessions/?doctor=${doctorId}&expand=patient_details`;
            if (searchQuery) url += `&search=${searchQuery}`;
            if (statusFilter !== 'All') url += `&status=${statusFilter}`;
            
            const response = await axios.get(url);
            
            const processedSessions = response.data.map(session => ({
                ...session,
                patient_name: session.patient_details 
                    ? `${session.patient_details.first_name || ''} ${session.patient_details.last_name || ''}`.trim()
                    : null,
                patient_details: session.patient_details || null
            }));
            
            setSessions(processedSessions);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            setMessage(error.response?.data?.message || 'Failed to load sessions');
        } finally {
            setIsLoading(false);
        }
    }, [doctorId, searchQuery, statusFilter]);

    useEffect(() => {
        if (activeTab === 'view') {
            fetchSessions();
        }
    }, [activeTab, fetchSessions]);

    const handleCreateSingleSession = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        
        if (!singleDate || !singleStartTime || !singleEndTime) {
            setMessage('Error: All fields are required');
            setIsLoading(false);
            return;
        }

        if (new Date(`${singleDate}T${singleStartTime}`) >= new Date(`${singleDate}T${singleEndTime}`)) {
            setMessage('Error: End time must be after start time');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/app/sessions/', {
                doctor: doctorId,
                date: singleDate,
                start_time: singleStartTime,
                end_time: singleEndTime,
                session_type: singleSessionType,
                status: 'FREE',
            });

            if (response.status === 201) {
                setMessage('Session created successfully!');
                setSingleDate('');
                setSingleStartTime('');
                setSingleEndTime('');
                fetchSessions();
            }
        } catch (error) {
            console.error('Error creating session:', error);
            const errorMsg = error.response?.data?.message || 
                            error.response?.data?.detail || 
                            error.message || 
                            'Failed to create session';
            setMessage(`Error: ${errorMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSessionType = (type) => {
        setSessionTypes(prev => 
            prev.includes(type) 
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleGenerateMultipleSessions = async (e) => {
        e.preventDefault();
        if (!doctorId) {
            setMessage('Error: Doctor ID is missing');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post('/app/sessions/generate/', {
                doctor: doctorId,
                start_date: startDate,
                end_date: endDate,
                start_time: startTime,
                end_time: endTime,
                session_types: sessionTypes,
            });
            setMessage('Sessions generated successfully!');
            setStartDate('');
            setEndDate('');
            setStartTime('');
            setEndTime('');
            fetchSessions();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to generate sessions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (session) => {
        if (session.status === 'BOOKED') {
            setCurrentSession(session);
            setConfirmAction('edit');
            setShowConfirmModal(true);
        } else {
            setCurrentSession(session);
            setShowEditModal(true);
        }
    };

    const handleDeleteClick = (session) => {
        setCurrentSession(session);
        setConfirmAction('delete');
        setShowConfirmModal(true);
    };

    const confirmActionHandler = () => {
        setShowConfirmModal(false);
        if (confirmAction === 'edit') {
            setShowEditModal(true);
        } else if (confirmAction === 'delete') {
            setShowDeleteModal(true);
        }
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
            case 'BOOKED': return 'session-booked';
            case 'FREE': return 'session-available';
            case 'COMPLETED': return 'session-completed';
            case 'CANCELLED': return 'session-cancelled';
            default: return '';
        }
    };

    const getSessionTypeIcon = (type) => {
        switch (type?.toUpperCase()) {
            case 'VIDEO': return <FaVideo className="session-type-icon" />;
            case 'VOICE': return <FaPhone className="session-type-icon" />;
            case 'MESSAGE': return <FaComment className="session-type-icon" />;
            default: return null;
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

    const getPatientDisplay = (session) => {
        if (session.status !== 'BOOKED' && session.status !== 'COMPLETED') return 'N/A';
        return session.patient_name || session.patient_details?.username || 'N/A';
    };

    return (
        <div className="therapy-session-manager">
            <SidebarDoctor />
            <Navbar />
            <div className="therapy-session-header">
                <h1>Therapy Session Manager</h1>
                <p>Streamline your therapy practice with our intuitive scheduling system</p>
            </div>

            <div className="therapy-session-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
                    onClick={() => setActiveTab('single')}
                >
                    <FaPlus /> Create Single Session
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'multiple' ? 'active' : ''}`}
                    onClick={() => setActiveTab('multiple')}
                >
                    <FaPlus /> Generate Multiple Sessions
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
                    onClick={() => setActiveTab('view')}
                >
                    View Appointments
                </button>
            </div>

            {message && (
                <div className={`therapy-session-message ${
                    message.includes('Error') || message.includes('Failed') ? 'error' : 'success'
                }`}>
                    {message}
                </div>
            )}

            {activeTab === 'single' && (
                <div className="therapy-session-form">
                    <h2>Create a New Session</h2>
                    <p className="form-subtitle">Fill in the details below to schedule a single therapy session.</p>
                    
                    <form onSubmit={handleCreateSingleSession}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={singleDate}
                                    onChange={(e) => setSingleDate(e.target.value)}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="time"
                                    value={singleStartTime}
                                    onChange={(e) => setSingleStartTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="time"
                                    value={singleEndTime}
                                    onChange={(e) => setSingleEndTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Session Type</label>
                            <div className="session-type-options">
                                <label className="session-type-option">
                                    <input
                                        type="radio"
                                        name="singleSessionType"
                                        value="VIDEO"
                                        checked={singleSessionType === 'VIDEO'}
                                        onChange={() => setSingleSessionType('VIDEO')}
                                    />
                                    <div className="option-content">
                                        <h4>Video Call</h4>
                                        <p>Face-to-face virtual session</p>
                                    </div>
                                </label>
                                <label className="session-type-option">
                                    <input
                                        type="radio"
                                        name="singleSessionType"
                                        value="VOICE"
                                        checked={singleSessionType === 'VOICE'}
                                        onChange={() => setSingleSessionType('VOICE')}
                                    />
                                    <div className="option-content">
                                        <h4>Voice Call</h4>
                                        <p>Audio-only therapy session</p>
                                    </div>
                                </label>
                                <label className="session-type-option">
                                    <input
                                        type="radio"
                                        name="singleSessionType"
                                        value="MESSAGE"
                                        checked={singleSessionType === 'MESSAGE'}
                                        onChange={() => setSingleSessionType('MESSAGE')}
                                    />
                                    <div className="option-content">
                                        <h4>Messages</h4>
                                        <p>Text-based communication</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Session'}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'multiple' && (
                <div className="therapy-session-form">
                    <h2>Generate Multiple Sessions</h2>
                    <p className="form-subtitle">Create a series of therapy sessions within a date range</p>
                    
                    <form onSubmit={handleGenerateMultipleSessions}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Session Types</label>
                            <div className="session-type-options multiple">
                                <label className="session-type-option">
                                    <input
                                        type="checkbox"
                                        checked={sessionTypes.includes('VIDEO')}
                                        onChange={() => toggleSessionType('VIDEO')}
                                    />
                                    <div className="option-content">
                                        <h4>Video Call</h4>
                                        <p>Face-to-face virtual session</p>
                                    </div>
                                </label>
                                <label className="session-type-option">
                                    <input
                                        type="checkbox"
                                        checked={sessionTypes.includes('VOICE')}
                                        onChange={() => toggleSessionType('VOICE')}
                                    />
                                    <div className="option-content">
                                        <h4>Voice Call</h4>
                                        <p>Audio-only therapy session</p>
                                    </div>
                                </label>
                                <label className="session-type-option">
                                    <input
                                        type="checkbox"
                                        checked={sessionTypes.includes('MESSAGE')}
                                        onChange={() => toggleSessionType('MESSAGE')}
                                    />
                                    <div className="option-content">
                                        <h4>Messages</h4>
                                        <p>Text-based communication</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Generating...' : 'Generate Sessions'}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'view' && (
                <div className="therapy-session-view">
                    <div className="view-filters">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search sessions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="status-filter"
                        >
                            <option value="All">All Statuses</option>
                            <option value="FREE">Available</option>
                            <option value="BOOKED">Booked</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    {isLoading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    ) : sessions.length > 0 ? (
                        <div className="sessions-table">
                            <table>
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
                                                <div className="session-date">
                                                    <FaCalendarAlt />
                                                    {formatDate(session.date)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="session-time">
                                                    <FaClock />
                                                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="session-type">
                                                    {getSessionTypeIcon(session.session_type)}
                                                    {getSessionTypeText(session.session_type)}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`session-status ${getStatusClass(session.status)}`}>
                                                    {session.status}
                                                </span>
                                            </td>
                                            <td>
                                                {getPatientDisplay(session)}
                                            </td>
                                            <td>
                                                <div className="session-actions">
                                                    <button 
                                                        className="action-btn edit"
                                                        onClick={() => handleEditClick(session)}
                                                        disabled={session.status === 'COMPLETED' || session.status === 'CANCELLED'}
                                                        title={session.status === 'COMPLETED' || session.status === 'CANCELLED' ? 
                                                            "Cannot edit completed/cancelled sessions" : ""}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button 
                                                        className="action-btn delete"
                                                        onClick={() => handleDeleteClick(session)}
                                                        disabled={session.status === 'COMPLETED'}
                                                        title={session.status === 'COMPLETED' ? 
                                                            "Cannot delete completed sessions" : ""}
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
                        <div className="no-sessions">
                            <p>No sessions found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Session Modal */}
            {showEditModal && currentSession && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Edit Session</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowEditModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleUpdateSession}>
                                <div className="form-group">
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
                                <div className="form-row">
                                    <div className="form-group">
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
                                    <div className="form-group">
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
                                </div>
                                <div className="form-group">
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
                        <div className="modal-footer">
                            <button 
                                className="modal-btn cancel"
                                onClick={() => setShowEditModal(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="modal-btn save"
                                onClick={handleUpdateSession}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Session Modal */}
            {showDeleteModal && currentSession && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Delete Session</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-content">
                            <p>Are you sure you want to delete this session?</p>
                            <div className="session-details">
                                <p><strong>Date:</strong> {formatDate(currentSession.date)}</p>
                                <p><strong>Time:</strong> {formatTime(currentSession.start_time)} - {formatTime(currentSession.end_time)}</p>
                                <p><strong>Type:</strong> {getSessionTypeText(currentSession.session_type)}</p>
                                <p><strong>Status:</strong> <span className={getStatusClass(currentSession.status)}>{currentSession.status}</span></p>
                                {(currentSession.status === 'BOOKED' || currentSession.status === 'COMPLETED') && (
                                    <p><strong>Patient:</strong> {getPatientDisplay(currentSession)}</p>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="modal-btn cancel"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="modal-btn delete"
                                onClick={confirmDelete}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal small-modal">
                        <div className="modal-header">
                            <h3>Confirmation Required</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-content">
                            {confirmAction === 'edit' && (
                                <p>This session is booked. The patient will be notified about changes. Are you sure you want to proceed?</p>
                            )}
                            {confirmAction === 'delete' && (
                                <p>Are you sure you want to delete this session? {currentSession?.status === 'BOOKED' && 'The patient will be notified.'}</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="modal-btn cancel"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="modal-btn confirm"
                                onClick={confirmActionHandler}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TherapySessionManager;