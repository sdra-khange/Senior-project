import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import axiosInstance from "../../utils/axios";
import Loading from "../../Components/Loading/Loading";

export default function PatientLogin() {
    const navigate = useNavigate();
    const cookie = Cookie();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axiosInstance.post('/login/patient/', {
                email: form.email,
                password: form.password,
            });

            const { tokens, user } = response.data;

            // تخزين بيانات المستخدم
            cookie.set("auth-token", tokens.access);
            cookie.set("user-type", "patient");
            cookie.set("user-data", JSON.stringify(user));

            // التوجيه إلى لوحة التحكم
            navigate("/patient/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message || 
                "An error occurred during login"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading />}
            <div className="container">
                <div className="row h-100">
                    <form className="form col-6" onSubmit={handleSubmit}>
                        <div className="custom-form">
                            <h1>Patient Login</h1>
                            
                            <div className="form-control">
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email..."
                                />
                                <label>Email</label>
                            </div>

                            <div className="form-control">
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    minLength="8"
                                    placeholder="Enter your password..."
                                />
                                <label>Password</label>
                            </div>

                            {error && <div className="error-message">{error}</div>}
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}