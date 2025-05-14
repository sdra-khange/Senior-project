import axios from "axios";
import { useState } from "react";
import { baseURL, REGISTER } from "../../API/Api";
import Loading from "../../Components/Loading/Loading";
import Cookie  from "cookie-universal";


export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    // Cookie
    const cookie = Cookie();
    // Error
    const [err, setErr] = useState("");
    // Loading
    const [loading, setLoading] = useState(false);

    

    // handle form change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${baseURL}/${REGISTER}`, form);
            setLoading(false);
            const token = res.data.access;
            cookie.set("e-commerce", token);
            window.location.pathname = "/users";
        } catch (err) {
            setLoading(false);
            setErr(err.response?.status === 422
                ? "Email is already been taken"
                : "Something went wrong"
            );
        }
    }

    return (
        <>
            {loading && <Loading />}
            <div className="container">
                <div className="row h-100">
                    <form className="form col-6" style={{height: "95%"}} onSubmit={handleSubmit}>
                        <div className="custom-form">
                            <h1>Register Now!</h1>
                            <div className="form-control">
                                <input
                                    name='name'
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name..."
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="name">User Name</label>
                            </div>

                            <div className="form-control">
                                <input
                                    name='email'
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email..."
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="form-control">
                                <input
                                    name='password'
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password..."
                                    value={form.password}
                                    onChange={handleChange}
                                    minLength="8"
                                    required
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                            <button className="btn btn-primary">Register</button>
                            {err !== "" && <span className="error">{err}</span>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
