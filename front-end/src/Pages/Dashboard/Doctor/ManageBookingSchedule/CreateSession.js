// import React, { useState } from 'react';
// import axios from '../../../../utils/axiosProfile';
// import './CreateSession.css';
// import Navbar from '../NavBardoctor';
// import SidebarDoctor from '../SidebarDoctor';

// const CreateSession = () => {
//     const [doctorId, setDoctorId] = useState('');
//     const [date, setDate] = useState('');
//     const [startTime, setStartTime] = useState('');
//     const [endTime, setEndTime] = useState('');
//     const [sessionType, setSessionType] = useState('VIDEO');
//     const [message, setMessage] = useState('');

//     const handleCreateSession = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post('/app/sessions/', {
//                 doctor: doctorId,
//                 date,
//                 start_time: startTime,
//                 end_time: endTime,
//                 session_type: sessionType,
//                 status: 'FREE',
//             });
//             setMessage('Session created successfully.');
//         } catch (error) {
//             console.error('Error creating session:', error);
//             setMessage('Error creating session.');
//         }
//     };

//     return (
//         <div className="create-session-container">
//             <SidebarDoctor />
//             <Navbar />
//             <h1>Create Session</h1>
//             {message && <p className="message">{message}</p>}
//             <form onSubmit={handleCreateSession}>
//                 <input type="text" placeholder="Doctor ID" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required />
//                 <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
//                 <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
//                 <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
//                 <select value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
//                     <option value="VIDEO">Video Call</option>
//                     <option value="VOICE">Voice Call</option>
//                     <option value="MESSAGE">Messages</option>
//                 </select>
//                 <button type="submit">Create Session</button>
//             </form>
//         </div>
//     );
// };

// export default CreateSession;

// app/Pages/Dashboard/Doctor/ManageBookingSchedule/CreateSession.js
import React, { useState } from 'react';
import axios from '../../../../utils/axiosProfile';
import './CreateSession.css';
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';

const CreateSession = () => {
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [sessionType, setSessionType] = useState('VIDEO');
    const [message, setMessage] = useState('');

    const handleCreateSession = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/app/sessions/', {
                doctor: doctorId,
                date,
                start_time: startTime,
                end_time: endTime,
                session_type: sessionType,
                status: 'FREE',
            });
            setMessage('Session created successfully.');
        } catch (error) {
            console.error('Error creating session:', error);
            setMessage('Error creating session.');
        }
    };

    return (
        <div className="create-session-container">
            <SidebarDoctor />
            <Navbar />
            <div className="create-session-card">
                <h1>Create Session</h1>
                {message && <p className="message">{message}</p>}
                <form onSubmit={handleCreateSession}>
                    <input 
                        type="text" 
                        placeholder="Doctor ID" 
                        value={doctorId} 
                        onChange={(e) => setDoctorId(e.target.value)} 
                        required 
                        className="input-field"
                    />
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                        className="input-field"
                    />
                    <input 
                        type="time" 
                        value={startTime} 
                        onChange={(e) => setStartTime(e.target.value)} 
                        required 
                        className="input-field"
                    />
                    <input 
                        type="time" 
                        value={endTime} 
                        onChange={(e) => setEndTime(e.target.value)} 
                        required 
                        className="input-field"
                    />
                    <select 
                        value={sessionType} 
                        onChange={(e) => setSessionType(e.target.value)} 
                        className="input-field"
                    >
                        <option value="VIDEO">Video Call</option>
                        <option value="VOICE">Voice Call</option>
                        <option value="MESSAGE">Messages</option>
                    </select>
                    <button type="submit" className="submit-button">Create Session</button>
                </form>
            </div>
        </div>
    );
};

export default CreateSession;