import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import axiosInstance from "../../utils/axios";
import Loading from "../../Components/Loading/Loading";

export default function DoctorRegister() {
    const navigate = useNavigate();
    const cookie = Cookie();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        user_type: "doctor",
        experience_file: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    //file upload
    const handleFileChange = (e) => {
        setForm({ ...form, experience_file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        // التحقق من تطابق كلمتي المرور
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        // استخدام FormData لإرسال البيانات مع الملف
        const formData = new FormData();
        formData.append('username', form.username);
        formData.append('email', form.email);
        formData.append('password', form.password);
        formData.append('user_type', form.user_type);

        // إضافة ملف الخبرة إذا تم رفعه
        if (form.experience_file) {
            formData.append('experience_file', form.experience_file);
        }

        try {
            const response = await axiosInstance.post('/signup/', form);
            

            const { tokens, user } = response.data;

            // store user data
            cookie.set("auth-token", tokens.access);
            cookie.set("user-type", "doctor");
            cookie.set("user-data", JSON.stringify(user));

            navigate("/doctor/profileDoctor");
        } catch (err) {
            setError(
                err.response?.data?.message || 
                "An error occurred during registration"
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
                            <h1>Doctor Registration</h1>
                            
                            <div className="form-control">
                                <input
                                    name="username"
                                    type="text"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your username..."
                                />
                                <label>Username</label>
                            </div>

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

                            <div className="form-control">
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    minLength="8"
                                    placeholder="Confirm your password..."
                                />
                                <label>Confirmation Password</label>
                            </div>


                            {form.user_type === "doctor" && (
                                <div className="form-control">
                                    <input
                                        name="experience_file"
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx"
                                        required
                                    />
                                    <label>Upload your CV or drag and drop it here</label>
                                </div>
                            )}

                            {error && <div className="error-message">{error}</div>}
                            <button type="submit" className="btn btn-primary">
                                Register as Doctor
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}