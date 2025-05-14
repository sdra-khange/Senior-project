import React, { useEffect, useState } from 'react';
import axios from '../../../../utils/axiosProfile';
import './ViewListAppointment.css'; 
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';


const ViewListAppointment = () => {
    const [sessions, setSessions] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch available sessions
    const fetchSessions = async () => {
        try {
            const response = await axios.get('/app/sessions/');
            setSessions(response.data);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    // Delete session
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/app/sessions/${id}/`);
            setMessage('Session deleted successfully.');
            fetchSessions();
        } catch (error) {
            console.error('Error deleting session:', error);
            setMessage('Error deleting session.');
        }
    };

    return (
        <div className="view-list-appointment-container">
            <SidebarDoctor />
            <Navbar />
            <h1>View List Appointment</h1>
            {message && <p className="message">{message}</p>}
            <table className="session-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((session) => (
                        <tr key={session.id}>
                            <td>{session.date}</td>
                            <td>{session.start_time}</td>
                            <td>{session.end_time}</td>
                            <td>{session.status}</td>
                            <td className="session-actions">
                                <button className="delete-button" onClick={() => handleDelete(session.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewListAppointment;
