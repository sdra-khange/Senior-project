import React, { useState } from 'react';
import axios from '../../../../utils/axiosProfile';
import './GenerateSessions.css';
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';

const GenerateSessions = () => {
    const [doctorId, setDoctorId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [sessionTypes, setSessionTypes] = useState(['VIDEO']);
    const [message, setMessage] = useState('');

    const handleGenerateSessions = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/app/sessions/generate/', {
                doctor: doctorId,
                start_date: startDate,
                end_date: endDate,
                start_time: startTime,
                end_time: endTime,
                session_types: sessionTypes,
            });
            setMessage('Sessions generated successfully.');
        } catch (error) {
            console.error('Error generating sessions:', error);
            setMessage('Error generating sessions.');
        }
    };

    return (
        <div className="generate-sessions-container">
            <SidebarDoctor />
            <Navbar />
            <div className="generate-sessions-card">
                <h1 className="generate-sessions-title">Generate Sessions</h1>
                {message && <p className="generate-sessions-message">{message}</p>}
                <form onSubmit={handleGenerateSessions} className="generate-sessions-form">
                    <label className="generate-sessions-label">Doctor ID</label>
                    <input 
                        type="text" 
                        placeholder="Enter Doctor ID" 
                        value={doctorId} 
                        onChange={(e) => setDoctorId(e.target.value)} 
                        required 
                        className="generate-sessions-input"
                    />
                    <label className="generate-sessions-label">Start Date</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        required 
                        className="generate-sessions-input"
                    />
                    <label className="generate-sessions-label">End Date</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        required 
                        className="generate-sessions-input"
                    />
                    <label className="generate-sessions-label">Start Time</label>
                    <input 
                        type="time" 
                        value={startTime} 
                        onChange={(e) => setStartTime(e.target.value)} 
                        required 
                        className="generate-sessions-input"
                    />
                    <label className="generate-sessions-label">End Time</label>
                    <input 
                        type="time" 
                        value={endTime} 
                        onChange={(e) => setEndTime(e.target.value)} 
                        required 
                        className="generate-sessions-input"
                    />
                    <label className="generate-sessions-label">Session Types</label>
                    <select 
                        multiple 
                        value={sessionTypes} 
                        onChange={(e) => setSessionTypes([...e.target.selectedOptions].map(option => option.value))} 
                        className="generate-sessions-input"
                    >
                        <option value="VIDEO">Video Call</option>
                        <option value="VOICE">Voice Call</option>
                        <option value="MESSAGE">Messages</option>
                    </select>
                    <button type="submit" className="generate-sessions-button">Generate Sessions</button>
                </form>
            </div>
        </div>
    );
};

export default GenerateSessions;