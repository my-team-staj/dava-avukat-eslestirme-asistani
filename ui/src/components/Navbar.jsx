import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBalanceScale, FaUserTie, FaList, FaPlus, FaHandshake } from "react-icons/fa";
import logo from "../assets/logo.png";
import "../App.css";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar-new">
      <Link to="/" className="navbar-logo-new">
        <span className="navbar-brand-text">LegXpert</span>
      </Link>
      <div className="navbar-links-new">
        <Link to="/davalar" className={isActive("/davalar")}>
          Davalar
        </Link>
        <Link to="/lawyers" className={isActive("/lawyers")}>
          Avukatlar
        </Link>
        <Link to="/match" className={`${isActive("/match")} primary-cta`}>
          Avukat Bul
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
