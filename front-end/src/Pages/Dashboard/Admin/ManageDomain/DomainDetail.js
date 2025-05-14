import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosDomains from "../../../../utils/axiosDomains";
import Sidebar from "../Sidebar";
import Navbar from "../NavBarAdmin";
import './DomainDetail.css';

export default function DomainDetail() {
    const { DomainID } = useParams();
    const navigate = useNavigate();
    const [domain, setDomain] = useState({ DomainName: "", DomainDescription: "" });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchDomain = async () => {
            try {
                const response = await axiosDomains.get(`/app/domains/${DomainID}/`);
                setDomain(response.data);
            } catch (error) {
                console.error("There was an error fetching the domain!", error);
            }
        };

        fetchDomain();
    }, [DomainID]);

    const handleChange = (e) => {
        setDomain({ ...domain, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosDomains.put(`/app/domains/${DomainID}/`, domain);
            setMessage("Domain updated successfully!");
            navigate("/admin/manage-domains");
        } catch (error) {
            console.error("There was an error updating the domain!", error);
        }
    };

    return (
        <div className="containers">
            <Navbar />
            <Sidebar />
            <div className="domain-detail ">
                <h1>Domain Detail</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h4>Domain Name:</h4>
                        <input type="text" name="DomainName" value={domain.DomainName} onChange={handleChange} required />
                    </div>
                    <div>
                        <h4>Description:</h4>
                        <textarea name="DomainDescription" value={domain.DomainDescription} onChange={handleChange} required />
                    </div>
                    <button type="submit">Update Domain</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}
