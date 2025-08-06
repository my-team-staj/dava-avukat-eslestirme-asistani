import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "../App.css";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar-new">
      <Link to="/" className="navbar-logo-new">
        <img src={logo} alt="LeXMatchGun" className="navbar-logo-img-new" />
        <span>LeXMatchGun</span>
      </Link>
      <div className="navbar-links-new">
        <Link to="/case-add" className={location.pathname === "/case-add" ? "active" : ""}>
          Dava Ekle
        </Link>
        <Link to="/lawyer-add" className={location.pathname === "/lawyer-add" ? "active" : ""}>
          Avukat Ekle
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
