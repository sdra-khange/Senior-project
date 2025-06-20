import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarDoctor from "../SidebarDoctor";
import Navbar from "../NavBardoctor";
import './ManageContent.css';

export default function ManageContent() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/app/blog/media/");
        const posts = res.data.post;
        const media = res.data.Media;

        const withMedia = posts.map(post => ({
          ...post,
          media: media.filter(m => m.blog === post.BlogID)
        }));

        setBlogs(withMedia);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, []);

  const handleLike = async (blogId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/app/blog/${blogId}/like/`);
      setBlogs(prev =>
        prev.map(blog =>
          blog.BlogID === blogId ? { ...blog, Likes: blog.Likes + 1 } : blog
        )
      );
    } catch (error) {
      console.error("Failed to like blog:", error);
    }
  };

  const handleImgError = (e) => {
    e.target.src = "https://via.placeholder.com/280x200?text=No+Image";
  };

  return (
    <div className="doctor-page">
      <SidebarDoctor />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Manage Blog Content</h1>
            <button
              className="add-btn styled-btn"
              onClick={() => navigate("/doctor/create-blog")}
            >
              + New Content
            </button>
          </div>

          {blogs.length === 0 ? (
            <p>No blog content found.</p>
          ) : (
            blogs.map(blog => (
              <div key={blog.BlogID} className="blog-card horizontal">
                <div className="blog-card-content">
                  <div className="header-row">
                    <h2>{blog.title}</h2>
                    <button
                      className="like-btn"
                      onClick={() => handleLike(blog.BlogID)}
                    >
                      ❤️ {blog.Likes} Like{blog.Likes !== 1 ? 's' : ''}
                    </button>
                  </div>
                  <p className="blog-content">{blog.content}</p>
                </div>

                <div className="media-list">
                  {blog.media.length === 0 ? (
                    <div className="media-item empty">No media</div>
                  ) : (
                    blog.media.map((m) => (
                      <div key={m.id} className="media-item">
                        {m.media_type === "image" && (
                          <img
                            src={`http://127.0.0.1:8000${m.file}`}
                            alt="media"
                            onError={handleImgError}
                          />
                        )}
                        {m.media_type === "video" && (
                          <video controls>
                            <source
                              src={`http://127.0.0.1:8000${m.file}`}
                              type="video/mp4"
                            />
                          </video>
                        )}
                        {m.media_type === "file" && (
                          <a
                            href={`http://127.0.0.1:8000${m.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download File
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
