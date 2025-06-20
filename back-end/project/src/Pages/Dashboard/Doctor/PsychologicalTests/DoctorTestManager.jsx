import React, { useState, useEffect } from 'react';
import axios from '../../../../utils/axiosProfile';
import { 
    FaPlus, FaEdit, FaTrash, FaEye, FaUsers, FaClipboardList, 
    FaSearch, FaFilter, FaChartBar, FaQuestionCircle 
} from 'react-icons/fa';
import './DoctorTestManager.css';
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';

const DoctorTestManager = () => {
    const [activeTab, setActiveTab] = useState('tests');
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Test form state
    const [showTestModal, setShowTestModal] = useState(false);
    const [testForm, setTestForm] = useState({
        TestName: '',
        TestDescription: '',
        IsActive: true
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/app/tests/');
            setTests(response.data);
        } catch (error) {
            setMessage('Failed to load tests');
            console.error('Error fetching tests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTest = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('/app/tests/', testForm);
            setMessage('Test created successfully');
            setShowTestModal(false);
            setTestForm({ TestName: '', TestDescription: '', IsActive: true });
            fetchTests();
        } catch (error) {
            setMessage('Failed to create test');
            console.error('Error creating test:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditTest = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.put(`/app/tests/${selectedTest.TestID}/`, testForm);
            setMessage('Test updated successfully');
            setShowTestModal(false);
            setIsEditing(false);
            setSelectedTest(null);
            fetchTests();
        } catch (error) {
            setMessage('Failed to update test');
            console.error('Error updating test:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTest = async (testId) => {
        if (window.confirm('Are you sure you want to delete this test?')) {
            try {
                await axios.delete(`/app/tests/${testId}/`);
                setMessage('Test deleted successfully');
                fetchTests();
            } catch (error) {
                setMessage('Failed to delete test');
                console.error('Error deleting test:', error);
            }
        }
    };

    const openEditModal = (test) => {
        setSelectedTest(test);
        setTestForm({
            TestName: test.TestName,
            TestDescription: test.TestDescription || '',
            IsActive: test.IsActive
        });
        setIsEditing(true);
        setShowTestModal(true);
    };

    const openCreateModal = () => {
        setTestForm({ TestName: '', TestDescription: '', IsActive: true });
        setIsEditing(false);
        setSelectedTest(null);
        setShowTestModal(true);
    };

    const filteredTests = tests.filter(test =>
        test.TestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (test.TestDescription && test.TestDescription.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="doctor-test-manager">
            <SidebarDoctor />
            <Navbar />
            
            <div className="test-manager-header">
                <h1>Psychological Test Manager</h1>
                <p>Create and manage psychological assessments for your patients</p>
            </div>

            <div className="test-manager-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tests')}
                >
                    <FaClipboardList /> My Tests
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'responses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('responses')}
                >
                    <FaUsers /> Patient Responses
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    <FaChartBar /> Analytics
                </button>
            </div>

            {message && (
                <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            {activeTab === 'tests' && (
                <div className="tests-section">
                    <div className="section-header">
                        <div className="search-filter">
                            <div className="search-box">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search tests..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="create-btn" onClick={openCreateModal}>
                            <FaPlus /> Create New Test
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="tests-grid">
                            {filteredTests.map((test) => (
                                <div key={test.TestID} className="test-card">
                                    <div className="test-header">
                                        <h3>{test.TestName}</h3>
                                        <div className="test-actions">
                                            <button 
                                                className="action-btn view"
                                                onClick={() => setSelectedTest(test)}
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>
                                            <button 
                                                className="action-btn edit"
                                                onClick={() => openEditModal(test)}
                                                title="Edit Test"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className="action-btn delete"
                                                onClick={() => handleDeleteTest(test.TestID)}
                                                title="Delete Test"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="test-content">
                                        <p className="test-description">
                                            {test.TestDescription || 'No description provided'}
                                        </p>
                                        
                                        <div className="test-stats">
                                            <div className="stat">
                                                <FaQuestionCircle />
                                                <span>{test.questions?.length || 0} Questions</span>
                                            </div>
                                            <div className="stat">
                                                <FaUsers />
                                                <span>{test.total_responses || 0} Responses</span>
                                            </div>
                                        </div>
                                        
                                        <div className="test-meta">
                                            <span className={`status ${test.IsActive ? 'active' : 'inactive'}`}>
                                                {test.IsActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className="created-date">
                                                Created: {formatDate(test.CreatedDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Test Modal */}
            {showTestModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{isEditing ? 'Edit Test' : 'Create New Test'}</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowTestModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={isEditing ? handleEditTest : handleCreateTest}>
                            <div className="form-group">
                                <label>Test Name *</label>
                                <input
                                    type="text"
                                    value={testForm.TestName}
                                    onChange={(e) => setTestForm({
                                        ...testForm,
                                        TestName: e.target.value
                                    })}
                                    required
                                    placeholder="Enter test name"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={testForm.TestDescription}
                                    onChange={(e) => setTestForm({
                                        ...testForm,
                                        TestDescription: e.target.value
                                    })}
                                    placeholder="Enter test description"
                                    rows="4"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={testForm.IsActive}
                                        onChange={(e) => setTestForm({
                                            ...testForm,
                                            IsActive: e.target.checked
                                        })}
                                    />
                                    Active
                                </label>
                            </div>
                            
                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={() => setShowTestModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorTestManager;
