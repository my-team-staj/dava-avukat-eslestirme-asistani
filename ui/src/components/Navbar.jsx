import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBalanceScale, FaUserTie, FaList, FaPlus, FaHandshake } from "react-icons/fa";
// Logo dosyası opsiyonel; dosya yoksa sadece metin gösterilecek
import "../App.css";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar-new">
      <Link to="/" className="navbar-logo-new">
        <img src="/lexpert-logo.svg" alt="lexpert" className="navbar-logo-img" />
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
