// import React, { useState } from 'react';
// import './ViewListAppointment.css';

// const EditSessionModal = ({ session, onClose, onSave }) => {
//     const [editedSession, setEditedSession] = useState({
//         date: session.date,
//         start_time: session.start_time,
//         end_time: session.end_time,
//         session_type: session.session_type
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEditedSession(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSave({
//             ...session,
//             ...editedSession
//         });
//     };

//     return (
//         <div className="doctor-edit-modal-overlay">
//             <div className="doctor-edit-modal-content">
//                 <h3 className="doctor-edit-modal-title">Edit Session</h3>
//                 <form onSubmit={handleSubmit}>
//                     <div className="doctor-edit-form-group">
//                         <label>Date</label>
//                         <input
//                             type="date"
//                             name="date"
//                             value={editedSession.date}
//                             onChange={handleChange}
//                             required
//                             className="doctor-edit-input"
//                         />
//                     </div>
                    
//                     <div className="doctor-edit-form-row">
//                         <div className="doctor-edit-form-group">
//                             <label>Start Time</label>
//                             <input
//                                 type="time"
//                                 name="start_time"
//                                 value={editedSession.start_time}
//                                 onChange={handleChange}
//                                 required
//                                 className="doctor-edit-input"
//                             />
//                         </div>
//                         <div className="doctor-edit-form-group">
//                             <label>End Time</label>
//                             <input
//                                 type="time"
//                                 name="end_time"
//                                 value={editedSession.end_time}
//                                 onChange={handleChange}
//                                 required
//                                 className="doctor-edit-input"
//                             />
//                         </div>
//                     </div>
                    
//                     <div className="doctor-edit-form-group">
//                         <label>Session Type</label>
//                         <select
//                             name="session_type"
//                             value={editedSession.session_type}
//                             onChange={handleChange}
//                             className="doctor-edit-select"
//                         >
//                             <option value="VIDEO">Video Call</option>
//                             <option value="VOICE">Voice Call</option>
//                             <option value="MESSAGE">Messages</option>
//                         </select>
//                     </div>
                    
//                     <div className="doctor-edit-modal-actions">
//                         <button 
//                             type="button" 
//                             onClick={onClose} 
//                             className="doctor-edit-cancel-btn"
//                         >
//                             Cancel
//                         </button>
//                         <button 
//                             type="submit" 
//                             className="doctor-edit-save-btn"
//                         >
//                             Save Changes
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditSessionModal;