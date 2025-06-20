// import React, { useState, useEffect } from "react";
// import axios from "../../../../utils/axiosDomains";
// import { useParams } from "react-router-dom";
// import Navbar from '../NavBardoctor';
// import SidebarDoctor from '../SidebarDoctor';
// import './ContentPage.css';


// export default function ContentPage() {
//     const [contents, setContents] = useState([]);
//     const [domains, setDomains] = useState([]);
//     const [selectedDomain, setSelectedDomain] = useState("");
//     const [selectedType, setSelectedType] = useState("");
//     const { domainId } = useParams();

//     useEffect(() => {
//         fetchData();
//     }, [domainId]);

//     const fetchData = async () => {
//         try {
//             const [domainsRes, contentsRes] = await Promise.all([
//                 axios.get('/app/domains/'),
//                 axios.get(`/app/public/content/?domain=${domainId || ''}`)
//             ]);
//             setDomains(domainsRes.data);
//             setContents(contentsRes.data);
//             if (domainId) {
//                 setSelectedDomain(domainId);
//             }
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     const handleFilter = async () => {
//         try {
//             let url = '/app/public/content/';
//             const params = new URLSearchParams();
            
//             if (selectedDomain) params.append('domain', selectedDomain);
//             if (selectedType) params.append('type', selectedType);
            
//             if (params.toString()) url += `?${params.toString()}`;
            
//             const response = await axios.get(url);
//             setContents(response.data);
//         } catch (error) {
//             console.error("Error filtering content:", error);
//         }
//     };

//     const getContentIcon = (type) => {
//         switch(type?.toLowerCase()) {
//             case 'video': return '🎬';
//             case 'article': return '📄';
//             case 'image': return '🖼️';
//             default: return '📌';
//         }
//     };

//     return (
//         <div className="content-page">
//             <SidebarDoctor />
//             <Navbar />
//             <div className="content-container">
//                 <div className="content-filters">
//                     <select 
//                         value={selectedDomain} 
//                         onChange={(e) => setSelectedDomain(e.target.value)}
//                     >
//                         <option value="">All Domains</option>
//                         {domains.map(domain => (
//                             <option key={domain.DomainID} value={domain.DomainID}>
//                                 {domain.DomainName}
//                             </option>
//                         ))}
//                     </select>
//                     <select 
//                         value={selectedType} 
//                         onChange={(e) => setSelectedType(e.target.value)}
//                     >
//                         <option value="">All Types</option>
//                         <option value="video">Video</option>
//                         <option value="article">Article</option>
//                         <option value="image">Image</option>
//                     </select>
//                     <button onClick={handleFilter}>Apply Filters</button>
//                 </div>

//                 <div className="content-grid">
//                     {contents.map(content => (
//                         <div key={content.ContentID} className="content-card">
//                             <div className="content-header">
//                                 <span className="content-type">
//                                     {getContentIcon(content.ContentType?.TypeName)}
//                                 </span>
//                                 <h3>{content.Title}</h3>
//                                 <span className="content-domain">
//                                     {content.Domain?.DomainName}
//                                 </span>
//                             </div>
//                             <p className="content-description">
//                                 {content.Description}
//                             </p>
//                             {content.File ? (
//                                 <div className="content-media">
//                                     {content.ContentType?.TypeName.toLowerCase() === 'image' ? (
//                                         <img 
//                                             src={`http://yourdomain.com${content.File}`} 
//                                             alt={content.Title}
//                                         />
//                                     ) : (
//                                         <video controls>
//                                             <source 
//                                                 src={`http://yourdomain.com${content.File}`} 
//                                                 type="video/mp4"
//                                             />
//                                         </video>
//                                     )}
//                                 </div>
//                             ) : content.URL ? (
//                                 <div className="content-media">
//                                     <iframe 
//                                         src={content.URL}
//                                         title={content.Title}
//                                         allowFullScreen
//                                     />
//                                 </div>
//                             ) : null}
//                             <div className="content-footer">
//                                 <span className="content-date">
//                                     {new Date(content.CreatedDate).toLocaleDateString()}
//                                 </span>
//                                 <span className="content-author">
//                                     By Dr. {content.CreatedBy}
//                                 </span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect } from "react";
import axios from "../../../../utils/axiosDomains";
import { useParams } from "react-router-dom";
import Navbar from '../NavBardoctor';
import SidebarDoctor from '../SidebarDoctor';
import './ContentPage.css';


export default function ContentPage() {
    const [contents, setContents] = useState([]);
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const { domainId } = useParams();

    useEffect(() => {
        fetchData();
    }, [domainId]);

    const fetchData = async () => {
        try {
            const [domainsRes, contentsRes] = await Promise.all([
                axios.get('/app/domains/'),
                axios.get(`/app/public/content/?domain=${domainId || ''}`)
            ]);
            setDomains(domainsRes.data);
            setContents(contentsRes.data);
            if (domainId) {
                setSelectedDomain(domainId);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleFilter = async () => {
        try {
            let url = '/app/public/content/';
            const params = new URLSearchParams();
            
            if (selectedDomain) params.append('domain', selectedDomain);
            if (selectedType) params.append('type', selectedType);
            
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await axios.get(url);
            setContents(response.data);
        } catch (error) {
            console.error("Error filtering content:", error);
        }
    };

    const getContentIcon = (type) => {
        switch(type?.toLowerCase()) {
            case 'video': return '🎬';
            case 'article': return '📄';
            case 'image': return '🖼️';
            default: return '📌';
        }
    };

    const renderMediaContent = (content) => {
        if (content.File) {
            const fileUrl = `http://localhost:8000${content.File}`; // Update with your actual domain
            
            if (content.ContentType?.TypeName.toLowerCase() === 'image') {
                return (
                    <div className="content-media">
                        <img 
                            src={fileUrl} 
                            alt={content.Title}
                            style={{maxHeight: '200px', objectFit: 'cover'}}
                        />
                    </div>
                );
            } else if (content.ContentType?.TypeName.toLowerCase() === 'video') {
                return (
                    <div className="content-media">
                        <video controls style={{width: '100%', maxHeight: '200px'}}>
                            <source src={fileUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                );
            }
        } else if (content.URL) {
            return (
                <div className="content-media">
                    <iframe 
                        src={content.URL}
                        title={content.Title}
                        allowFullScreen
                        style={{width: '100%', height: '200px', border: 'none'}}
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <div className="content-page">
            <SidebarDoctor />
            <Navbar />
            <div className="content-container">
                <div className="content-filters">
                    <select 
                        value={selectedDomain} 
                        onChange={(e) => setSelectedDomain(e.target.value)}
                    >
                        <option value="">All Domains</option>
                        {domains.map(domain => (
                            <option key={domain.DomainID} value={domain.DomainID}>
                                {domain.DomainName}
                            </option>
                        ))}
                    </select>
                    <select 
                        value={selectedType} 
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                        <option value="image">Image</option>
                    </select>
                    <button onClick={handleFilter}>Apply Filters</button>
                </div>

                <div className="content-grid">
                    {contents.map(content => (
                        <div key={content.ContentID} className="content-card">
                            <div className="content-header">
                                <span className="content-type">
                                    {getContentIcon(content.ContentType?.TypeName)}
                                </span>
                                <h3>{content.Title}</h3>
                                <span className="content-domain">
                                    {content.Domain?.DomainName}
                                </span>
                            </div>
                            <p className="content-description">
                                {content.Description}
                            </p>
                            {renderMediaContent(content)}
                            <div className="content-footer">
                                <span className="content-date">
                                    {new Date(content.CreatedDate).toLocaleDateString()}
                                </span>
                                <span className="content-author">
                                    By Dr. {content.CreatedBy}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}