import React, { useState } from "react";
import axios from "../../../../utils/axiosDomains";
import { useParams, useNavigate } from "react-router-dom";
import SidebarDoctor from "../SidebarDoctor";
import Navbar from "../NavBardoctor";
import "./AddMedia.css";

export default function AddMedia() {
    const [file, setFile] = useState(null);
    const [mediaType, setMediaType] = useState("image");
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { blogID } = useParams();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile && (mediaType === "image" || mediaType === "video")) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
    };

    const handleMediaTypeChange = (e) => {
        setMediaType(e.target.value);
        setFile(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("media_type", mediaType);
        formData.append("blog", blogID);

        try {
            await axios.post("/app/blog/media/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/doctor/ManageContent");
        } catch (err) {
            setError("Upload failed. Please try again.");
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
                        <h1>Upload Media for Blog</h1>
                        <p className="step-indicator">Step 2 of 2: Add Media</p>
                    </div>
                    <div className="add-media-wrapper">
                        <form className="add-media-form" onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="form-section">
                                <label htmlFor="media-type">Media Type</label>
                                <select
                                    id="media-type"
                                    className="form-select"
                                    value={mediaType}
                                    onChange={handleMediaTypeChange}
                                >
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                    <option value="file">File</option>
                                </select>
                            </div>
                            <div className="form-section">
                                <label htmlFor="file-upload">Choose File</label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept={
                                        mediaType === "image"
                                            ? "image/*"
                                            : mediaType === "video"
                                            ? "video/*"
                                            : "*"
                                    }
                                    onChange={handleFileChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            {preview && mediaType === "image" && (
                                <div className="media-preview">
                                    <img src={preview} alt="Preview" />
                                </div>
                            )}
                            {preview && mediaType === "video" && (
                                <div className="media-preview">
                                    <video src={preview} controls width="100%" />
                                </div>
                            )}
                            {error && <div className="error-message">{error}</div>}
                            <div className="submit-section">
                                <button className="submit-btn" type="submit" disabled={isLoading || !file}>
                                    {isLoading ? (
                                        <span className="spinner"></span>
                                    ) : (
                                        <span className="btn-content">Upload & Finish</span>
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