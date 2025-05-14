import Navbar from './Navbar';  
import { FaUser, FaChartBar, FaGlobe, FaStethoscope, FaVideo } from 'react-icons/fa';
import "./AboutPage.css";

export default function AboutPage() {
    return (
        <div className="about-page">
            <Navbar />
            <div className="about-content">
                <h2>Our service</h2>
                <h3>Better Together is an integrated solution for providing psychological care and well-being services remotely </h3>
                <h3>through sessions, lectures and support groups provided by licensed specialists.</h3>
                <br></br>
                <div className="services-icons">
                    <div className="service">
                        <FaUser className="icon" />
                        <p>Scheduled sessions</p>
                    </div>
                    <div className="service">
                        <FaChartBar className="icon" />
                        <p>Instant sessions</p>
                    </div>
                    <div className="service">
                        <FaGlobe className="icon" />
                        <p>Support groups</p>
                    </div>
                    <div className="service">
                        <FaStethoscope className="icon" />
                        <p>Therapy programs</p>
                    </div>
                    <div className="service">
                        <FaVideo className="icon" />
                        <p>Recorded webinars</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

