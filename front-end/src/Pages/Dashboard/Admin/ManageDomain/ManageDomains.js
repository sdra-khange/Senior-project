import React, { useState, useEffect } from "react";
import axiosDomains from "../../../../utils/axiosDomains";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../NavBarAdmin";
import './ManageDomains.css';

export default function ManageDomains() {
    const [domains, setDomains] = useState([]);
    const [newDomain, setNewDomain] = useState({ DomainName: "", DomainDescription: "" });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const { data } = await axiosDomains.get('/app/domains/');
                setDomains(data);
            } catch (error) {
                console.error("There was an error fetching the domains!", error);
            }
        };

        fetchDomains();
    }, []);

    const handleChange = (e) => {
        setNewDomain({ ...newDomain, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosDomains.post('/app/domains/', newDomain);
            setMessage("Domain created successfully!");
            
            setNewDomain({ DomainName: "", DomainDescription: "" });

            const { data } = await axiosDomains.get('/app/domains/');
            setDomains(data);
        } catch (error) {
            console.error("There was an error creating the domain!", error);
        }
    };

    const handleDelete = async (DomainID) => {
        try {
            await axiosDomains.delete(`/app/domains/${DomainID}/`);
            setMessage("Domain deleted successfully!");
            const { data } = await axiosDomains.get('/app/domains/');
            setDomains(data);
        } catch (error) {
            console.error("There was an error deleting the domain!", error);
        }
    };

    return (
        <div className="containers">
            <Navbar />
            <Sidebar />
            <div className="manage-domains">
                <div className="domain-create-form">
                    <h2>Create New Domain</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <h4>Domain Name:</h4>
                            <input type="text" name="DomainName" placeholder="Domain Name" value={newDomain.DomainName} onChange={handleChange} required />
                        </div>
                        <div>
                            <h4>Description:</h4>
                            <textarea name="DomainDescription" placeholder="Domain Description" value={newDomain.DomainDescription} onChange={handleChange} required />
                        </div>
                        <button type="submit">Create Domain</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
                <div className="domain-list">
                    <h2>Existing Domains</h2>
                    <ul>
                        {domains.map(domain => (
                            <li key={domain.DomainID} className="domain-box">
                                <span>{domain.DomainName}</span>
                                <div>
                                    <button className="delete-button" onClick={() => handleDelete(domain.DomainID)}>Delete</button>
                                    <Link className="view-button" to={`/admin/manage-domains/${domain.DomainID}`}>View</Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
