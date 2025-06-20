import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserSlash, FaUserCheck } from 'react-icons/fa';
import axios from '../../../../utils/axios';
import Sidebar from "../Sidebar";
import Navbar from "../NavBarAdmin";
import './ManageDoctors.css';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('/doctor/profile/');
                console.log('Doctors Data:', response.data); 
                if (response.data && response.data.length > 0) {
                    setDoctors(response.data);
                } else {
                    setError('No doctors found in the system');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching doctors:', err);
                setError('Failed to load doctors. Please check server connection');
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleStatusChange = async (doctorId, isActive) => {
        try {
            await axios.put(`/doctor/status/${doctorId}/`, { is_active: !isActive });
            
            setDoctors(prevDoctors =>
                prevDoctors.map(doctor =>
                    doctor.user.id === doctorId
                        ? {
                            ...doctor,
                            user: {
                                ...doctor.user,
                                is_active: !isActive
                            }
                        }
                        : doctor
                )
            );
        } catch (err) {
            setError('Failed to update doctor status');
            console.error("Error updating doctor status:", err);
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            doctor.user.username.toLowerCase().includes(searchTermLower) ||
            (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTermLower))
        );
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading doctors...</p>
            </div>
        );
    }

    return (
        <div className={`admin-container ${sidebarOpen ? '' : 'collapsed'}`}>
            <Sidebar isOpen={sidebarOpen} />
            <div className="main-content">
                <Navbar toggleSidebar={toggleSidebar} />
                
                <div className="manage-doctors">
                    <div className="page-header">
                        <h1>Manage your doctors and their information</h1>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="doctors-toolbar">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search doctors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="doctors-table-container">
                        <table className="doctors-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Profile</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Specialization</th>
                                    <th>Experience</th>
                                    <th>Session Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDoctors.length > 0 ? (
                                    filteredDoctors.map(doctor => (
                                        <tr key={doctor.id}>
                                            <td>{doctor.id}</td>
                                            <td>
                                                {doctor.profile_picture ? (
                                                    <img 
                                                        src={doctor.profile_picture} 
                                                        alt={doctor.user.username} 
                                                        className="doctor-avatar"
                                                    />
                                                ) : (
                                                    <div className="avatar-placeholder">
                                                        {doctor.user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </td>
                                            <td>{doctor.user.username}</td>
                                            <td>{doctor.user.email}</td>
                                            <td>{doctor.specialization}</td>
                                            <td>{doctor.experience_years} years</td>
                                            <td>${doctor.session_price}</td>
                                            <td>
                                                <span className={`status-badge ${doctor.user.is_active ? 'active' : 'inactive'}`}>
                                                    {doctor.user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleStatusChange(doctor.user.id, doctor.user.is_active)}
                                                    className={`status-btn ${doctor.user.is_active ? 'deactivate' : 'activate'}`}
                                                >
                                                    {doctor.user.is_active ? (
                                                        <>
                                                            <FaUserSlash /> Deactivate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaUserCheck /> Activate
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="no-data">
                                            {doctors.length === 0 ? 'No doctors found in system' : 'No matching doctors found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageDoctors;