import React, { useState, useEffect } from "react";
import axiosDomains from "../../../../utils/axiosDomains";
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import Sidebar from "../Sidebar";
import Navbar from "../NavBarAdmin";
import './ManageDomains.css';

export default function ManageDomains() {
    const [domains, setDomains] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [sortOrder, setSortOrder] = useState("Date (Newest)");
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDomainId, setSelectedDomainId] = useState(null);
    const [currentDomain, setCurrentDomain] = useState({
        DomainName: "",
        DomainDescription: "",
        Status: "Active"
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        try {
            setLoading(true);
            const response = await axiosDomains.get('/app/domains/');
            setDomains(response.data);
            setError("");
        } catch (error) {
            setError("Failed to fetch domains");
            console.error("Error fetching domains:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        try {
            const response = await axiosDomains.get(`/app/domains/?search=${value}`);
            setDomains(response.data);
        } catch (error) {
            console.error("Error searching domains:", error);
        }
    };

    const handleStatusChange = async (e) => {
        const status = e.target.value;
        setStatusFilter(status);
        try {
            const response = await axiosDomains.get(`/app/domains/?status=${status}`);
            setDomains(response.data);
        } catch (error) {
            console.error("Error filtering domains:", error);
        }
    };

    const handleSortChange = async (e) => {
        const sort = e.target.value;
        setSortOrder(sort);
        let sortParam = '';
        switch (sort) {
            case 'Date (Newest)':
                sortParam = 'date_desc';
                break;
            case 'Date (Oldest)':
                sortParam = 'date_asc';
                break;
            case 'Name (A-Z)':
                sortParam = 'name_asc';
                break;
            case 'Name (Z-A)':
                sortParam = 'name_desc';
                break;
            default:
                sortParam = 'date_desc';
        }
        try {
            const response = await axiosDomains.get(`/app/domains/?sort_by=${sortParam}`);
            setDomains(response.data);
        } catch (error) {
            console.error("Error sorting domains:", error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCurrentDomain({ DomainName: "", DomainDescription: "", Status: "Active" });
        setIsEditing(false);
        setError("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentDomain(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            if (isEditing) {
                await axiosDomains.put(`/app/domains/${currentDomain.DomainID}/`, currentDomain);
            } else {
                await axiosDomains.post('/app/domains/', currentDomain);
            }
            handleModalClose();
            await fetchDomains();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to save domain");
            console.error("Error saving domain:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (domain) => {
        setCurrentDomain({
            DomainID: domain.DomainID,
            DomainName: domain.DomainName,
            DomainDescription: domain.DomainDescription,
            Status: domain.Status
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        setSelectedDomainId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            await axiosDomains.delete(`/app/domains/${selectedDomainId}/`);
            await fetchDomains();
            setShowDeleteModal(false);
        } catch (error) {
            setError("Failed to delete domain");
            console.error("Error deleting domain:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'status-active';
            case 'inactive': return 'status-inactive';
            case 'pending': return 'status-pending';
            default: return '';
        }
    };

    return (
        <div className="admin-page">
            <Navbar />
            <Sidebar />
            <div className="content-wrapper">
                <div className="page-header">
                    <div>
                        <h1>Manage Domains</h1>
                        <p>Create, edit, and manage all domains in the system</p>
                    </div>
                    <button className="add-domain-btn" onClick={() => setShowModal(true)}>
                        Add New Domain
                    </button>
                </div>

                <div className="filters-row">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search domains..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="filter-options">
                        <select value={statusFilter} onChange={handleStatusChange}>
                            <option>All Statuses</option>
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Pending</option>
                        </select>
                        <select value={sortOrder} onChange={handleSortChange}>
                            <option>Date (Newest)</option>
                            <option>Date (Oldest)</option>
                            <option>Name (A-Z)</option>
                            <option>Name (Z-A)</option>
                        </select>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="domains-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Domain Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Created Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {domains.map(domain => (
                                <tr key={domain.DomainID}>
                                    <td>{domain.DomainName}</td>
                                    <td>{domain.DomainDescription}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusColor(domain.Status)}`}>
                                            {domain.Status}
                                        </span>
                                    </td>
                                    <td>{new Date(domain.CreatedDate).toLocaleDateString()}</td>
                                    <td>
                                        <button className="action-btn edit" onClick={() => handleEdit(domain)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-btn delete" onClick={() => handleDelete(domain.DomainID)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <button className="close-btn" onClick={handleModalClose}>
                                    <IoClose size={20} />
                                </button>
                            </div>
                            <div className="modal-content">
                                <h2 className="modal-title">{isEditing ? 'Edit Domain' : 'Add New Domain'}</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Domain Name</label>
                                        <input
                                            type="text"
                                            name="DomainName"
                                            placeholder="Enter domain name"
                                            value={currentDomain.DomainName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            name="DomainDescription"
                                            placeholder="Enter domain description"
                                            value={currentDomain.DomainDescription}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select
                                            name="Status"
                                            value={currentDomain.Status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Pending">Pending</option>
                                        </select>
                                    </div>
                                    <div className="button-group">
                                        <button type="button" className="cancel-btn" onClick={handleModalClose}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="save-btn" disabled={loading}>
                                            {isEditing ? 'Save Changes' : 'Save Domain'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <h2>Delete Domain</h2>
                                <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                    <IoClose size={20} />
                                </button>
                            </div>
                            <div className="modal-content">
                                <p className="delete-message">Are you sure you want to delete this domain?</p>
                                <div className="button-group">
                                    <button type="button" className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="button" className="delete-btn" onClick={confirmDelete} disabled={loading}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
