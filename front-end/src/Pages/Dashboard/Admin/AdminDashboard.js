import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUsers, FaUserMd, FaUserCheck} from 'react-icons/fa';
import axios from '../../../utils/axios';
import Sidebar from "../Admin/Sidebar";
import Navbar from "./NavBarAdmin";
import './AdminDashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_users: 0,
        total_doctors: 0,
        active_accounts: 0,
        doctors: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const activityData = [
        { name: 'Sun', consultations: 20, appointments: 15 },
        { name: 'Mon', consultations: 30, appointments: 25 },
        { name: 'Tue', consultations: 40, appointments: 35 },
        { name: 'Wed', consultations: 35, appointments: 30 },
        { name: 'Thu', consultations: 50, appointments: 45 },
        { name: 'Fri', consultations: 45, appointments: 40 },
        { name: 'Sat', consultations: 60, appointments: 55 }
    ];

    const usersData = [
        { name: 'Jan', total: 100, active: 80 },
        { name: 'Feb', total: 150, active: 120 },
        { name: 'Mar', total: 200, active: 180 },
        { name: 'Apr', total: 250, active: 220 },
        { name: 'May', total: 300, active: 280 },
        { name: 'Jun', total: 350, active: 320 },
        { name: 'Jul', total: 400, active: 380 },
        { name: 'Aug', total: 450, active: 420 },
        { name: 'Sep', total: 500, active: 480 },
        { name: 'Oct', total: 550, active: 520 },
        { name: 'Nov', total: 600, active: 550 },
        { name: 'Dec', total: 650, active: 600 }
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/admin/stats/');
                setStats(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load data. Please check server connection');
                setLoading(false);
                console.error("Error fetching stats:", err);
            }
        };
        fetchStats();
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading data...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-container">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main-content">
                <Navbar toggleSidebar={toggleSidebar} />
                
                <div className="admin-dashboard">
                    {/* Header */}
                    <div className="dashboard-header">
                        <h1>Welcome to  your Dashboard</h1>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {/* Stats Cards */}
                    <div className="stats-container">
                        <div className="stat-card">
                            <div className="stat-value">{stats.total_users}</div>
                            <div className="stat-title">Total Users</div>
                            <div className="stat-subtitle">New users today</div>
                            <div className="stat-icon users">
                                <FaUsers />
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-value">{stats.total_doctors}</div>
                            <div className="stat-title">Total Doctors</div>
                            <div className="stat-subtitle">New doctors today</div>
                            <div className="stat-icon doctors">
                                <FaUserMd />
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-value">{stats.active_accounts}</div>
                            <div className="stat-title">Active Accounts</div>
                            <div className="stat-subtitle">Active today</div>
                            <div className="stat-icon active">
                                <FaUserCheck />
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-value">42%</div>
                            <div className="stat-title">System Activity</div>
                            <div className="stat-subtitle">Usage today</div>
                            <div className="stat-icon system">
                                <FaUserCheck />
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="charts-row">
                        <div className="chart-container">
                            <h2>Activity Report</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="consultations" fill="#8884d8" />
                                    <Bar dataKey="appointments" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-container">
                            <h2>User Statistics</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={usersData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="total" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="active" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;