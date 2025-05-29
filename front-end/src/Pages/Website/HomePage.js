import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
    return (
        <div className="home-page">
            <Navbar />
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Discover a Better You :</h1>
                    <p>Start Your Journey to Mental Wellness Today</p>
                    <Link to="/patient/signup" className="signup-button">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
