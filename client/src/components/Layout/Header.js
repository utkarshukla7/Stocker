import React from "react";
import "./Header.css";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auht";
import SearchComponent from "../SearchComponent";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
  };
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary"
      style={{ position: "fixed", width: "100vw", zIndex: "10" }}
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <a className="navbar-brand">
            <Link to={"/"} className={"nav-link"}>
              STOCKER
            </Link>
          </a>
          <SearchComponent />
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!auth.user ? (
              <>
                <li className="nav-item  ">
                  <NavLink to={"/register"} className="nav-link ">
                    Sign up
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={"/login"} className="nav-link ">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to={"/dashboard"} className={"nav-link "}>
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item ">
                  <NavLink
                    onClick={handleLogout}
                    to={"/"}
                    className={"nav-link "}
                  >
                    Logout
                  </NavLink>
                </li>
                {/* <li className="nav-item">
                                        <NavLink to={"/user"} className={"nav-link "}>
                                            Profile
                                        </NavLink>
                                    </li> */}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
