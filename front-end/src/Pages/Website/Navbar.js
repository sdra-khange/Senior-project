import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="logo">Better Together</div>
            <div className="nav-links">
                <Link to="/" className={location.pathname === "/" ? "active" : ""}>
                    Home
                </Link>
                <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
                    About
                </Link>
                <Link to="/specialists" className={location.pathname === "/specialists" ? "active" : ""}>
                    Specialists
                </Link>
                <Link to="/assessments" className={location.pathname === "/assessments" ? "active" : ""}>
                    Assessments
                </Link>
                <Link to="/blog" className={location.pathname === "/blog" ? "active" : ""}>
                    Blog
                </Link>
                
            </div>
            <Link to="/patient/login" className="login-button">
                Login
            </Link>
        </nav>
    );
}

export default Navbar;