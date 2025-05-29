import React, { useState, useEffect } from 'react';
import axiosTherapy from "../../../../utils/axiosTherapy";
import { FaUserMd, FaSearch, FaClinicMedical, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './PatientDoctorsList.css';
import SidebarPatient from '../SidebarPatient';
import NavbarPatient from '../NavBarPatient';

const PatientDoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [specializationFilter, setSpecializationFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axiosTherapy.get('/doctors/');
                setDoctors(response.data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
                alert('Failed to load doctors. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialization = specializationFilter ? 
            doctor.specialization === specializationFilter : true;
        return matchesSearch && matchesSpecialization;
    });

    const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];

    return (
        <div className="patient-doctors-container">
            <SidebarPatient />
            <NavbarPatient />
            <div className="doctors-header">
                <h1>Find Your Therapist</h1>
                <p>Connect with licensed professionals who can help you</p>
            </div>

            <div className="doctors-filters">
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search doctors by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <select
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                    className="specialization-filter"
                >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading doctors...</p>
                </div>
            ) : (
                <div className="doctors-grid">
                    {filteredDoctors.map(doctor => (
                        <div key={doctor.id} className="doctor-card">
                            <div className="doctor-image-container">
                                {doctor.profile_photo ? (
                                    <img 
                                        src={`http://localhost:8000${doctor.profile_photo}`} 
                                        alt={doctor.username}
                                        className="doctor-image"
                                    />
                                ) : (
                                    <div className="default-avatar">
                                        <FaUserMd />
                                    </div>
                                )}
                            </div>
                            <div className="doctor-info">
                                <h3>Dr. {doctor.username}</h3>
                                <p className="specialization">
                                    <FaClinicMedical /> {doctor.specialization}
                                </p>
                                <p className="experience">{doctor.experience_years} years experience</p>
                                <p className="price">${doctor.session_price} per session</p>
                                
                                <button 
                                    className="view-profile-btn"
                                    onClick={() => navigate(`/patient/PatientDoctorsList/${doctor.id}`)}
                                    >
                                    View Profile <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientDoctorsList;