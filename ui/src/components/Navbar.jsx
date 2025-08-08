import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "../App.css";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar-new">
      <Link to="/" className="navbar-logo-new">
        <img src={logo} alt="LeXMatchGun" className="navbar-logo-img-new" />
        <span>LeXMatchGun</span>
      </Link>
      <div className="navbar-links-new">
        <Link to="/case-add" className={isActive("/case-add")}>
          Dava Ekle
        </Link>
        <Link to="/cases" className={isActive("/cases")}>
          Dava Listesi
        </Link>
        <Link to="/lawyer-add" className={isActive("/lawyer-add")}>
          Avukat Ekle
        </Link>
        <Link to="/lawyers" className={isActive("/lawyers")}>
          Avukat Listesi
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
