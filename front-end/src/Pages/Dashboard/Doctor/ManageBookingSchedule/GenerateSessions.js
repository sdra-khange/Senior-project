import React, { useState, useEffect } from 'react';
import axios from '../../../../utils/axiosProfile';
import './GenerateSessions.css';
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';
import Cookie from 'cookie-universal';

const GenerateSessions = () => {
    const cookies = Cookie();
    const [doctorId, setDoctorId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [sessionTypes, setSessionTypes] = useState(['VIDEO']);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const userData = cookies.get('user-data');
        if (userData?.id) setDoctorId(userData.id);
    }, [cookies]);

    const toggleSessionType = (type) => {
        setSessionTypes(prev => 
            prev.includes(type) 
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleSubmit = async (e) => {
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
            // Reset form
            setStartDate('');
            setEndDate('');
            setStartTime('');
            setEndTime('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to generate sessions');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="generate-sessions-container">
            <SidebarDoctor />
            <Navbar />
            <div className="generate-sessions-card">
                <h1>Generate Therapy Sessions</h1>
                <p className="subtitle">Create multiple sessions based on your availability</p>
                
                {message && (
                    <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
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

                    <div className="session-types">
                        <label>Session Types</label>
                        <div className="options">
                            {[
                                { value: 'VIDEO', label: 'Video Call' },
                                { value: 'VOICE', label: 'Voice Call' },
                                { value: 'MESSAGE', label: 'Messages' }
                            ].map((type) => (
                                <label key={type.value} className="option">
                                    <input
                                        type="checkbox"
                                        checked={sessionTypes.includes(type.value)}
                                        onChange={() => toggleSessionType(type.value)}
                                    />
                                    <span>{type.label}</span>
                                </label>
                            ))}
                        </div>
                        <p className="hint">Select all that apply</p>
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate Sessions'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GenerateSessions;