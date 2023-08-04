import { React, useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasssword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  //form submision
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents page to be refreshed as default
    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.meassage);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };
  return (
    <Layout>
      <form className="form-register" onSubmit={handleSubmit}>
        <p className="form-title">Create new account</p>
        <div className="input-container">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            id="InputName"
            placeholder="Name"
            required
          />
        </div>

        <div className="input-container">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            id="Email"
            placeholder="Email"
            required
          />
        </div>

        <div className="input-container">
          <input
            type="password"
            value={password}
            onChange={(e) => setPasssword(e.target.value)}
            className="form-control"
            id="InputPassword1"
            placeholder="Password"
            required
          />
        </div>

        <div className="input-container">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-control"
            id="InputPhone"
            placeholder="Phone"
            required
          />
        </div>

        <div className="input-container">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-control"
            id="InputAddress"
            placeholder="Address"
            required
          />
        </div>
        <button className="submit" type="submit">
          Sign up
        </button>
        <p className="signup-link">
          already registered?
          <NavLink to={"/login"} className="login-to-signup">
            Log in
          </NavLink>
        </p>
      </form>
    </Layout>
  );
};

export default Register;
