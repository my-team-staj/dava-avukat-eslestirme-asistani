import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaBalanceScale, FaUserTie, FaMagic } from "react-icons/fa";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-hero-bg">
      <section className="hero-main">
        <img src={logo} alt="LeXMatchGun" className="hero-logo" />
        <h1>
          Adaletin Geleceği: <span className="gradient-text">LeXMatchGun</span>
        </h1>
        <p>
          Yapay zeka destekli eşleştirme ile en uygun avukatı kolayca bulun.<br />
          <b>Modern, hızlı ve güvenilir adli süreç platformu.</b>
        </p>
        <div className="hero-btns">
          <button className="primary-btn" onClick={() => navigate("/case-add")}>
            <FaBalanceScale style={{ marginRight: 8 }} /> Dava Ekle
          </button>
          <button className="secondary-btn" onClick={() => navigate("/lawyer-add")}>
            <FaUserTie style={{ marginRight: 8 }} /> Avukat Ekle
          </button>
        </div>
      </section>
      <section className="cards-panel">
        <div className="feature-card">
          <FaMagic className="feature-icon" />
          <h3>Akıllı Eşleştirme</h3>
          <p>Davanız için en uygun avukatı, saniyeler içinde önerir.</p>
        </div>
        <div className="feature-card">
          <FaUserTie className="feature-icon" />
          <h3>Uzman Havuzu</h3>
          <p>Her branştan, deneyimli avukatlarla çalışma fırsatı.</p>
        </div>
        <div className="feature-card">
          <FaBalanceScale className="feature-icon" />
          <h3>Kolay Kullanım</h3>
          <p>Modern ve kullanıcı dostu arayüz ile işlemler çok pratik.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
