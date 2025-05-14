// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Cookie from "cookie-universal";
// import axiosInstance from "../../utils/axios";
// import Loading from "../../Components/Loading/Loading";

// export default function PatientRegister() {
//     const navigate = useNavigate();
//     const cookie = Cookie();
//     const [form, setForm] = useState({
//         username: "",
//         email: "",
//         password: "",
//         user_type: "patient"
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         try {
//             const response = await axiosInstance.post('/signup/', form);

//             const { tokens, user } = response.data;

//             // تخزين بيانات المستخدم
//             cookie.set("auth-token", tokens.access);
//             cookie.set("user-type", "patient");
//             cookie.set("user-data", JSON.stringify(user));

//             // التوجيه إلى لوحة التحكم
//             navigate("/patient/dashboard");
//         } catch (err) {
//             setError(
//                 err.response?.data?.message || 
//                 "An error occurred during registration"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             {loading && <Loading />}
//             <div className="container">
//                 <div className="row h-100">
//                     <form className="form col-6" onSubmit={handleSubmit}>
//                         <div className="custom-form">
//                             <h1>Patient Registration</h1>
                            
//                             <div className="form-control">
//                                 <input
//                                     name="username"
//                                     type="text"
//                                     value={form.username}
//                                     onChange={handleChange}
//                                     required
//                                     placeholder="Enter your username..."
//                                 />
//                                 <label>Username</label>
//                             </div>

//                             <div className="form-control">
//                                 <input
//                                     name="email"
//                                     type="email"
//                                     value={form.email}
//                                     onChange={handleChange}
//                                     required
//                                     placeholder="Enter your email..."
//                                 />
//                                 <label>Email</label>
//                             </div>

//                             <div className="form-control">
//                                 <input
//                                     name="password"
//                                     type="password"
//                                     value={form.password}
//                                     onChange={handleChange}
//                                     required
//                                     minLength="8"
//                                     placeholder="Enter your password..."
//                                 />
//                                 <label>Password</label>
//                             </div>

//                             {error && <div className="error-message">{error}</div>}
//                             <button type="submit" className="btn btn-primary">
//                                 Register
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import axiosInstance from "../../utils/axios";
import Loading from "../../Components/Loading/Loading";

export default function PatientRegister() {
    const navigate = useNavigate();
    const cookie = Cookie();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        user_type: "patient"
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

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/signup/', form);

            const { tokens, user } = response.data;

            // store user data
            cookie.set("auth-token", tokens.access);
            cookie.set("user-type", "patient");
            cookie.set("user-data", JSON.stringify(user));

            navigate("/patient/dashboard");
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
                            <h1>Patient Registration</h1>
                            
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

                            {error && <div className="error-message">{error}</div>}
                            <button type="submit" className="btn btn-primary">
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}