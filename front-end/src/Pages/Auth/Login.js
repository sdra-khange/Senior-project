import axios from "axios";
import { useState } from "react";
import { baseURL, LOGIN } from "../../API/Api";
import Loading from "../../Components/Loading/Loading";
import MRIImage from '../../Css/components/MRI1.jpg';
import Cookie  from "cookie-universal";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    
    // Error 
    const [err, setErr] = useState("");
    
    // Loading
    const [loading, setLoading] = useState(false);
    
    // Cookie
    const cookie = Cookie();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await axios.post(`${baseURL}/${LOGIN}`, {
                email: form.email,
                password: form.password,
            });
            const token = res.data.access;
            cookie.set("e-commerce", token);
            window.location.pathname = "/users";
            
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if(err.response.status === 401){
                setErr("Invalid email or password");
            }else{
                setErr("Something went wrong");
            }
        }
    }

    return (
        <>
            {loading && <Loading />}
            <div className="container">
                <div className="row h-100">
                    <form className="form col-6" 
                    style={{height: "70%", backgroundImage: `linear-gradient(110deg, white 0%, white 50% , transparent 50%), url(${MRIImage})`}} 
                    
                    onSubmit={handleSubmit}>
                        <div className="custom-form">
                            <h1>Login Now!</h1>
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
                                {err !== "" && <span className="error">{err}</span>}
                                <button className="btn btn-primary">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
