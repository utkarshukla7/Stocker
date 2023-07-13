import { React, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPasssword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();
    //form submision
    const handleSubmit = async (e) => {
        e.preventDefault()                //prevents page to be refreshed as default
        try {
            const res = await axios.post('/api/v1/auth/register', { name, email, password, phone, address });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
            else {
                toast.error(res.data.meassage);
            }
        }
        catch (error) {
            console.log(error);
            toast.error("something went wrong");
        }
    }
    return (
        <Layout>
            <div className='register'>
                <h1 className='heading' >Sign up</h1>
                <form onSubmit={handleSubmit}>


                    <div className="mb-3">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="InputName" placeholder='Name' required />
                    </div>

                    <div className="mb-3">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="Email" placeholder='Email' required />
                    </div>

                    <div className="mb-3">
                        <input type="password" value={password} onChange={(e) => setPasssword(e.target.value)} className="form-control" id="InputPassword1" placeholder='Password' required />
                    </div>

                    <div className="mb-3">
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="InputPhone" placeholder='Phone' required />
                    </div>

                    <div className="mb-3">
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" id="InputAddress" placeholder='Address' required />
                    </div>


                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>

            </div>
        </Layout>
    )
}

export default Register
