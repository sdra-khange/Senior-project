import Navbar from './Navbar';  
import { Link } from "react-router-dom";
import "./Specialists.css";

// export default function Specialists() {
//     return (
//         <div className="specialists-page">
//             <Navbar />
//             <div className="specialists-content">
//                 <h2>Our Medical Specialists</h2>
//                 <p>Join our team of professional healthcare providers</p>
//                 <div className="doctor-actions">
//                     <Link to="/doctor/signup" className="doctor-signup">Doctor Sign Up</Link>
//                     <Link to="/doctor/login" className="doctor-login">Doctor Login</Link>
//                 </div>
//             </div>
//         </div>
//     );
// }



export default function Specialists() {
    return (
        <div className="specialists-page">
            <Navbar />
            <div className="specialists-content">
                <h2>Our Medical Specialists</h2>
                <p>Join our team of professional healthcare providers</p>
                <div className="doctor-actions">
                    <Link to="/doctor/signup" className="doctor-signup">Doctor Sign Up</Link>
                    <Link to="/doctor/login" className="doctor-login">Doctor Login</Link>
                </div>
            </div>
        </div>
    );
}
