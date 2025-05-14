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

// import Navbar from "./Navbar";
// import { Link } from "react-router-dom";
// import { FaUser, FaChartBar, FaGlobe, FaStethoscope, FaTasks } from 'react-icons/fa';
// import "./HomePage.css";

// export default function HomePage() {
//     return (
//         <div className="home-page">
//             <Navbar />
//             <div className="hero-section">
//                 <div className="hero-content">
//                     <h1>Discover a Better You :</h1>
//                     <p>Start Your Journey to Mental Wellness Today</p>
//                     <Link to="/patient/signup" className="signup-button">Sign Up</Link>
//                 </div>
//             </div>
//             <div className="services-section">
//                 <h2>Our Services</h2>
//                 <h3>Better Together is an integrated solution for providing psychological care and well-being services remotely</h3>
//                 <h3> through sessions, lectures and support groups provided by licensed specialists. </h3>
//                 <h1> </h1>
//                 <div className="services-icons">
//                     <div className="service">
//                         <FaUser className="icon" />
//                         <p>Scheduled sessions</p>
//                     </div>
//                     <div className="service">
//                         <FaChartBar className="icon" />
//                         <p>Instant sessions</p>
//                     </div>
//                     <div className="service">
//                         <FaGlobe className="icon" />
//                         <p>Support groups</p>
//                     </div>
//                     <div className="service">
//                         <FaStethoscope className="icon" />
//                         <p>Therapy programs</p>
//                     </div>
//                     <div className="service">
//                         <FaTasks className="icon" />
//                         <p>Recorded webinars</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
