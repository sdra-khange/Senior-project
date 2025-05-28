import React, { useState, useEffect } from 'react';
import axios from '../../../../utils/axiosProfile';
import './CreateSession.css';
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';
import Cookie from 'cookie-universal';

const CreateSession = () => {
    const cookies = Cookie();
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [sessionType, setSessionType] = useState('VIDEO');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const userData = cookies.get('user-data');
        if (userData?.id) {
            setDoctorId(userData.id);
        } else {
            setMessage('Error: Doctor ID not found in cookies');
        }
    }, [cookies]);

    const handleCreateSession = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        // التحقق من صحة البيانات
        if (!date || !startTime || !endTime) {
            setMessage('Error: All fields are required');
            setIsLoading(false);
            return;
        }

        if (new Date(`${date}T${startTime}`) >= new Date(`${date}T${endTime}`)) {
            setMessage('Error: End time must be after start time');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Submitting session data:', {
                doctor: doctorId,
                date,
                start_time: startTime,
                end_time: endTime,
                session_type: sessionType
            });

            const response = await axios.post('/app/sessions/', {
                doctor: doctorId,
                date,
                start_time: startTime,
                end_time: endTime,
                session_type: sessionType,
                status: 'FREE',
            });

            if (response.status === 201) {
                setMessage('Session created successfully!');
                // Reset form
                setDate('');
                setStartTime('');
                setEndTime('');
            } else {
                setMessage(`Unexpected response: ${response.status}`);
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

    return (
        <div className="create-session-container">
            <SidebarDoctor />
            <Navbar />
            <div className="create-session-card">
                <h1>Create Therapy Session</h1>
                <p className="subtitle">Add a single session</p>
                
                {message && (
                    <div className={message.startsWith('Error') ? 'error-message' : 'success-message'}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleCreateSession}>
                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="input-field"
                            min={new Date().toISOString().split('T')[0]} // لا تسمح بتواريخ قديمة
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label>End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Session Type</label>
                        <select
                            value={sessionType}
                            onChange={(e) => setSessionType(e.target.value)}
                            className="input-field"
                        >
                            <option value="VIDEO">Video Call</option>
                            <option value="VOICE">Voice Call</option>
                            <option value="MESSAGE">Messages</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading || !doctorId} 
                        className="submit-button"
                    >
                        {isLoading ? 'Creating...' : 'Create Session'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateSession;