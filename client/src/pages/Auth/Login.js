import { React, useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auht";
import { set } from "mongoose";
import "./login.css";
import { NavLink } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPasssword] = useState("");
  const [auth, setAuth] = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  //form submision
  //window.loca
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents page to be refreshed as default
    try {
      const res = await axios.post("/api/v1/auth/login", { email, password });
      if (res && res.data.success) {
        toast.success("Login successfull!");
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else if (res.data.flag === 2) {
        toast.error("Retry!!");
        navigate("/login");
      } else {
        navigate("/register");
        toast.error("No user found!");
      }
    } catch (error) {
      console.log(error);
      navigate("/register");
      toast.error("something went wrong");
    }
  };
  return (
    <Layout>
      <form className="form" onSubmit={handleSubmit}>
        <p className="form-title">Login to your account</p>
        <div className="input-container">
          <input
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <input
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPasssword(e.target.value)}
            required
          />
        </div>
        <button className="submit" type="submit">
          Log in
        </button>
        <p className="signup-link">
          No account?
          <NavLink to={"/register"} className="login-to-signup">
            Sign up
          </NavLink>
        </p>
      </form>
    </Layout>
  );
};

export default Login;
