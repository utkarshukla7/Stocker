import { React, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auht';
import { set } from 'mongoose';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPasssword] = useState("");
    const [auth, setAuth] = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    //form submision
    //window.loca
    const handleSubmit = async (e) => {
        e.preventDefault()                //prevents page to be refreshed as default
        try {
            const res = await axios.post('/api/v1/auth/login', { email, password });
            if (res && res.data.success) {
                toast.success("Login successfull!");
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                })
                localStorage.setItem("auth", JSON.stringify(res.data));
                navigate(location.state || "/");
            }
            else if (res.data.flag === 2) {
                toast.error("Retry!!");
                navigate("/login");
            }
            else {
                navigate("/register");
                toast.error("No user found!");
            }
        }
        catch (error) {
            console.log(error);
            navigate("/register");
            toast.error("something went wrong");
        }
    }
    return (
        <Layout>
            <div className='login'>
                <h1 className='heading'>Login</h1>
                <form onSubmit={handleSubmit}>


                    <div className="mb-3">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="Email" placeholder='Email' required />
                    </div>

                    <div className="mb-3">
                        <input type="password" value={password} onChange={(e) => setPasssword(e.target.value)} className="form-control" id="InputPassword1" placeholder='Password' required />
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>

            </div>
        </Layout>
    )
}

export default Login
