import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaBalanceScale, FaUserTie, FaMagic, FaRocket, FaShieldAlt, FaChartLine, FaHandshake } from "react-icons/fa";
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
          Yapay zeka destekli akıllı eşleştirme sistemi ile en uygun avukatı saniyeler içinde bulun.<br />
          <b>Modern, güvenli ve kullanıcı dostu adli süreç platformu.</b>
        </p>
        <div className="hero-btns">
          <button className="secondary-btn" onClick={() => navigate("/case-add")}>
            <FaBalanceScale style={{ marginRight: 8 }} /> Dava Ekle
          </button>
          <button className="secondary-btn" onClick={() => navigate("/lawyer-add")}>
            <FaUserTie style={{ marginRight: 8 }} /> Avukat Ekle
          </button>
          <button className="secondary-btn" onClick={() => navigate("/match")}>
  <FaHandshake style={{ marginRight: 8 }} /> Eşleştirme Yap
</button>

        </div>
      </section>
      
      <section className="cards-panel">
        <div className="feature-card hover-lift">
          <FaMagic className="feature-icon" />
          <h3>Akıllı Eşleştirme</h3>
          <p>Gelişmiş AI algoritması ile davanız için en uygun avukatı, saniyeler içinde önerir ve eşleştirir.</p>
        </div>
        
        <div className="feature-card hover-lift">
          <FaUserTie className="feature-icon" />
          <h3>Uzman Havuzu</h3>
          <p>Her hukuk branşından, deneyimli ve uzman avukatlarla çalışma fırsatı sunar.</p>
        </div>
        
        <div className="feature-card hover-lift">
          <FaRocket className="feature-icon" />
          <h3>Hızlı İşlem</h3>
          <p>Modern ve kullanıcı dostu arayüz ile tüm işlemler çok pratik ve hızlı şekilde gerçekleştirilir.</p>
        </div>
        
        <div className="feature-card hover-lift">
          <FaShieldAlt className="feature-icon" />
          <h3>Güvenli Platform</h3>
          <p>Veri güvenliği ve gizlilik standartları ile korunan, güvenilir adli süreç yönetimi.</p>
        </div>
        
        <div className="feature-card hover-lift">
          <FaChartLine className="feature-icon" />
          <h3>Analitik Raporlar</h3>
          <p>Detaylı istatistikler ve raporlama özellikleri ile süreçlerinizi takip edin.</p>
        </div>
        
        <div className="feature-card hover-lift">
          <FaBalanceScale className="feature-icon" />
          <h3>Kolay Yönetim</h3>
          <p>Dava ve avukat bilgilerini kolayca yönetin, güncelleyin ve organize edin.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
