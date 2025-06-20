import React, { useState, useEffect } from 'react';
import axios from '../../../../utils/axiosProfile';
import { 
    FaClipboardList, FaPlay, FaCheck, FaClock, FaEye, 
    FaSearch, FaFilter, FaHistory, FaQuestionCircle 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './PatientTestList.css';
import NavbarPatient from '../NavbarPatient';
import SidebarPatient from '../SidebarPatient';

const PatientTestList = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [testHistory, setTestHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('available');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAvailableTests();
        fetchTestHistory();
    }, []);

    const fetchAvailableTests = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/app/patient/tests/');
            setTests(response.data);
        } catch (error) {
            setMessage('Failed to load available tests');
            console.error('Error fetching tests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTestHistory = async () => {
        try {
            const response = await axios.get('/app/patient/test-history/');
            setTestHistory(response.data);
        } catch (error) {
            console.error('Error fetching test history:', error);
        }
    };

    const handleStartTest = async (testId) => {
        try {
            const response = await axios.post(`/app/patient/tests/${testId}/start/`);
            setMessage(response.data.message);
            navigate(`/patient/tests/${testId}/take`);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to start test');
        }
    };

    const getTestStatusIcon = (status) => {
        if (status.is_completed) return <FaCheck className="status-icon completed" />;
        if (status.has_taken) return <FaClock className="status-icon in-progress" />;
        return <FaPlay className="status-icon available" />;
    };

    const getTestStatusText = (status) => {
        if (status.is_completed) return 'Completed';
        if (status.has_taken) return 'In Progress';
        return 'Available';
    };

    const getTestStatusClass = (status) => {
        if (status.is_completed) return 'completed';
        if (status.has_taken) return 'in-progress';
        return 'available';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const filteredTests = tests.filter(test =>
        test.TestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (test.TestDescription && test.TestDescription.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredHistory = testHistory.filter(response =>
        response.Test.TestName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="patient-test-list">
            <SidebarPatient />
            <NavbarPatient />
            
            <div className="test-list-header">
                <h1>Psychological Assessments</h1>
                <p>Complete psychological tests assigned by your healthcare providers</p>
            </div>

            <div className="test-list-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
                    onClick={() => setActiveTab('available')}
                >
                    <FaClipboardList /> Available Tests
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    <FaHistory /> Test History
                </button>
            </div>

            {message && (
                <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="test-list-content">
                <div className="search-section">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab === 'available' ? 'tests' : 'history'}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {activeTab === 'available' && (
                    <div className="available-tests">
                        {isLoading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                            </div>
                        ) : filteredTests.length > 0 ? (
                            <div className="tests-grid">
                                {filteredTests.map((test) => (
                                    <div key={test.TestID} className="test-card">
                                        <div className="test-header">
                                            <h3>{test.TestName}</h3>
                                            <div className="test-status">
                                                {getTestStatusIcon(test.patient_status)}
                                                <span className={`status-text ${getTestStatusClass(test.patient_status)}`}>
                                                    {getTestStatusText(test.patient_status)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="test-content">
                                            <p className="test-description">
                                                {test.TestDescription || 'No description provided'}
                                            </p>
                                            
                                            <div className="test-info">
                                                <div className="info-item">
                                                    <FaQuestionCircle />
                                                    <span>{test.questions?.length || 0} Questions</span>
                                                </div>
                                                <div className="info-item">
                                                    <span>Created by: {test.CreatedBy}</span>
                                                </div>
                                            </div>
                                            
                                            {test.patient_status.started_at && (
                                                <div className="test-progress">
                                                    <small>Started: {formatDateTime(test.patient_status.started_at)}</small>
                                                </div>
                                            )}
                                            
                                            {test.patient_status.completed_at && (
                                                <div className="test-completion">
                                                    <small>Completed: {formatDateTime(test.patient_status.completed_at)}</small>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="test-actions">
                                            {test.patient_status.is_completed ? (
                                                <button 
                                                    className="action-btn view"
                                                    onClick={() => navigate(`/patient/tests/${test.TestID}/results`)}
                                                >
                                                    <FaEye /> View Results
                                                </button>
                                            ) : (
                                                <button 
                                                    className="action-btn start"
                                                    onClick={() => handleStartTest(test.TestID)}
                                                >
                                                    {test.patient_status.has_taken ? (
                                                        <>
                                                            <FaPlay /> Continue Test
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaPlay /> Start Test
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-tests">
                                <FaClipboardList className="no-tests-icon" />
                                <h3>No Tests Available</h3>
                                <p>There are currently no psychological tests assigned to you.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="test-history">
                        {filteredHistory.length > 0 ? (
                            <div className="history-list">
                                {filteredHistory.map((response) => (
                                    <div key={response.ResponseID} className="history-item">
                                        <div className="history-header">
                                            <h4>{response.Test.TestName}</h4>
                                            <span className={`history-status ${response.IsCompleted ? 'completed' : 'incomplete'}`}>
                                                {response.IsCompleted ? 'Completed' : 'Incomplete'}
                                            </span>
                                        </div>
                                        
                                        <div className="history-content">
                                            <p>{response.Test.TestDescription || 'No description provided'}</p>
                                            
                                            <div className="history-dates">
                                                <div className="date-item">
                                                    <strong>Started:</strong> {formatDateTime(response.StartedAt)}
                                                </div>
                                                {response.CompletedAt && (
                                                    <div className="date-item">
                                                        <strong>Completed:</strong> {formatDateTime(response.CompletedAt)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="history-actions">
                                            {response.IsCompleted ? (
                                                <button 
                                                    className="action-btn view"
                                                    onClick={() => navigate(`/patient/tests/${response.Test.TestID}/results`)}
                                                >
                                                    <FaEye /> View Results
                                                </button>
                                            ) : (
                                                <button 
                                                    className="action-btn continue"
                                                    onClick={() => navigate(`/patient/tests/${response.Test.TestID}/take`)}
                                                >
                                                    <FaPlay /> Continue
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-history">
                                <FaHistory className="no-history-icon" />
                                <h3>No Test History</h3>
                                <p>You haven't taken any psychological tests yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientTestList;
