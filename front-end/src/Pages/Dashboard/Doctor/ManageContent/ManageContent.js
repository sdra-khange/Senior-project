import React, { useState, useEffect } from "react";
import axios from "../../../../utils/axiosDomains";
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import SidebarDoctor from "../SidebarDoctor";
import Navbar from "../NavBardoctor";
import './ManageContent.css';


export default function ManageContent() {
    const [contents, setContents] = useState([]);
    const [domains, setDomains] = useState([]);
    const [contentTypes, setContentTypes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [currentContent, setCurrentContent] = useState({
        Title: "",
        Description: "",
        ContentType: "",
        Domain: "",
        File: null,
        URL: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [domainsRes, typesRes, contentsRes] = await Promise.all([
                axios.get('/app/domains/'),
                axios.get('/app/content-types/'),
                axios.get('/app/content/')
            ]);
            setDomains(domainsRes.data);
            setContentTypes(typesRes.data);
            setContents(contentsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentContent(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setCurrentContent(prev => ({ ...prev, File: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(currentContent).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        try {
            if (currentContent.id) {
                await axios.put(`/app/content/${currentContent.id}/`, formData);
            } else {
                await axios.post('/app/content/', formData);
            }
            setShowForm(false);
            fetchData();
        } catch (error) {
            console.error("Error saving content:", error);
        }
    };

    const handleEdit = (content) => {
        setCurrentContent(content);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this content?")) {
            try {
                await axios.delete(`/app/content/${id}/`);
                fetchData();
            } catch (error) {
                console.error("Error deleting content:", error);
            }
        }
    };

    return (
        <div className="doctor-page">
            <SidebarDoctor />
            <Navbar />
            <div className="content-wrapper">
                <div className="page-header">
                    <h1>Manage Content</h1>
                    <button className="add-btn" onClick={() => {
                        setCurrentContent({
                            Title: "",
                            Description: "",
                            ContentType: "",
                            Domain: "",
                            File: null,
                            URL: ""
                        });
                        setShowForm(true);
                    }}>
                        <FaPlus /> Add New Content
                    </button>
                </div>

                {showForm && (
                    <div className="content-form">
                        <h2>{currentContent.id ? "Edit Content" : "Add New Content"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="Title"
                                    value={currentContent.Title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="Description"
                                    value={currentContent.Description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Domain</label>
                                <select
                                    name="Domain"
                                    value={currentContent.Domain}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Domain</option>
                                    {domains.map(domain => (
                                        <option key={domain.DomainID} value={domain.DomainID}>
                                            {domain.DomainName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Content Type</label>
                                <select
                                    name="ContentType"
                                    value={currentContent.ContentType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    {contentTypes.map(type => (
                                        <option key={type.TypeID} value={type.TypeID}>
                                            {type.TypeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>File (for images/videos)</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>OR URL (for external videos)</label>
                                <input
                                    type="url"
                                    name="URL"
                                    value={currentContent.URL}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="content-list">
                    <div className="search-bar">
                        <FaSearch />
                        <input type="text" placeholder="Search content..." />
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Domain</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contents.map(content => (
                                <tr key={content.ContentID}>
                                    <td>{content.Title}</td>
                                    <td>{content.Domain?.DomainName}</td>
                                    <td>{content.ContentType?.TypeName}</td>
                                    <td>{new Date(content.CreatedDate).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => handleEdit(content)}>
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(content.ContentID)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}