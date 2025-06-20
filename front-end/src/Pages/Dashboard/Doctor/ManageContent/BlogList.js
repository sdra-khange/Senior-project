import React, { useEffect, useState } from "react";
import axios from "../../../../utils/axiosDomains";
import "./BlogList.css";

export default function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [media, setMedia] = useState([]);
    const [search, setSearch] = useState("");
    const [doctorId, setDoctorId] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("http://127.0.0.1:8000/app/blog/media/");
                setBlogs(res.data.post);
                setMedia(res.data.Media);
            } catch (err) {
                console.error("Error fetching data:", err);
                setBlogs([]);
                setMedia([]);
            }
        }
        fetchData();
    }, []);

    const handleLike = async (blogId) => {
        try {
            await axios.post(`http://127.0.0.1:8000/app/blog/${blogId}/like/`);
            setBlogs(prev =>
                prev.map(blog =>
                    blog.BlogID === blogId
                        ? { ...blog, Likes: blog.Likes + 1 }
                        : blog
                )
            );
        } catch (error) {
            console.error("Like failed:", error);
        }
    };

    const getMediaForBlog = (blogId) =>
        media.filter(m => m.blog === blogId);

    const filteredBlogs = blogs.filter(blog => {
        const matchTitle = blog.title?.toLowerCase().includes(search.toLowerCase());
        const matchContent = blog.content?.toLowerCase().includes(search.toLowerCase());
        const matchDoctor = doctorId ? String(blog.DoctorID) === String(doctorId) : true;
        return (matchTitle || matchContent) && matchDoctor;
    });

    return (
        <div className="blog-list-page">
            <div className="blog-list-header">
                <h1>All Blogs</h1>
                <p>Browse and enjoy all content. Click ❤️ to like!</p>
            </div>

            <div className="blog-list-filters">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Filter by Doctor ID"
                    value={doctorId}
                    onChange={e => setDoctorId(e.target.value)}
                />
            </div>

            <div className="blog-list-cards">
                {filteredBlogs.length === 0 ? (
                    <div className="no-blogs">No blogs found.</div>
                ) : (
                    filteredBlogs.map(blog => {
                        const blogMedia = getMediaForBlog(blog.BlogID);
                        return (
                            <div className="blog-card" key={blog.BlogID}>
                                {blogMedia.length > 0 && blogMedia[0].media_type === "image" && (
                                    <img
                                        className="blog-card-img"
                                        src={`http://127.0.0.1:8000${blogMedia[0].file}`}
                                        alt="blog"
                                    />
                                )}
                                <div className="blog-card-content">
                                    <div className="blog-card-meta">
                                        <span className="blog-card-category">Blog</span>
                                        <span
                                            className="blog-card-likes"
                                            onClick={() => handleLike(blog.BlogID)}
                                            style={{ cursor: "pointer" }}
                                            title="Click to like"
                                        >
                                            ❤️ {blog.Likes}
                                        </span>
                                    </div>
                                    <h2 className="blog-card-title">{blog.title}</h2>
                                    <p className="blog-card-desc">{blog.content}</p>
                                    {/* Removed "Read full article" */}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
