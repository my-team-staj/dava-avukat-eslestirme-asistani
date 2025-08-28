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
        <img src={logo} alt="LeXMatchGun" className="navbar-logo-img-new" />
        <span>LeXMatchGun</span>
      </Link>
      <div className="navbar-links-new">
        <Link to="/case-add" className={isActive("/case-add")}>
          <FaPlus style={{ marginRight: 8 }} />
          Dava Ekle
        </Link>
        <Link to="/cases" className={isActive("/cases")}>
          <FaList style={{ marginRight: 8 }} />
          Dava Listesi
        </Link>
        <Link to="/lawyer-add" className={isActive("/lawyer-add")}>
          <FaPlus style={{ marginRight: 8 }} />
          Avukat Ekle
        </Link>
        <Link to="/lawyers" className={isActive("/lawyers")}>
          <FaUserTie style={{ marginRight: 8 }} />
          Avukat Listesi
        </Link>
        <Link to="/match" className={isActive("/match")}>
          <FaHandshake style={{ marginRight: 8 }} />
          Eşleştirme
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
