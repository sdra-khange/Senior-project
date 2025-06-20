import React, { useState, useEffect } from "react";
import axios from "../../../../utils/axiosDomains";
import { useNavigate } from "react-router-dom";
import SidebarDoctor from "../SidebarDoctor";
import Navbar from "../NavBardoctor";
import "./CreateBlog.css";

export default function CreateBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [domainID, setDomainID] = useState("");
    const [domains, setDomains] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/app/domains/").then(res => {
            setDomains(res.data);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const doctorID = localStorage.getItem("DoctorID");

        try {
            const res = await axios.post("/app/blog/", {
                title,
                content,
                DoctorID: doctorID,
                DomainID: domainID
            });
            const blogID = res.data.BlogID;
            localStorage.setItem("BlodID", blogID);
            navigate(`/doctor/add-media/${blogID}`);
        } catch (error) {
            setError("Failed to create blog. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="doctor-page">
            <SidebarDoctor />
            <div className="main-content">
                <Navbar />
                <div className="content-wrapper">
                    <div className="page-header">
                        <h1>Create Blog</h1>
                    </div>
                    <div className="create-blog-wrapper">
                        <form className="blog-form" onSubmit={handleSubmit}>
                            <div className="form-section">
                                <label>Title</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                    placeholder="Enter blog title"
                                />
                            </div>
                            <div className="form-section">
                                <label>Content</label>
                                <textarea
                                    className="form-textarea"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    required
                                    rows={6}
                                    placeholder="Write your blog content here..."
                                />
                                <div className="char-counter">{content.length} characters</div>
                            </div>
                            <div className="form-section">
                                <label>Domain</label>
                                <select
                                    className="form-select"
                                    value={domainID}
                                    onChange={e => setDomainID(e.target.value)}
                                    required
                                >
                                    <option value="">Choose a domain</option>
                                    {domains.map(d => (
                                        <option key={d.DomainID} value={d.DomainID}>
                                            {d.DomainName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <div className="submit-section">
                                <button className="submit-btn" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="spinner"></span>
                                    ) : (
                                        <span className="btn-content">Create Blog & Continue</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}