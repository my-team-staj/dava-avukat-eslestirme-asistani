import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-hero-bg">
      <section className="hero-main">
          <h1 className="brand-title">LegXpert</h1>
          <p className="brand-slogan">
            Yapay zeka destekli akıllı eşleştirme sistemi ile en uygun avukatı saniyeler içinde bulun.
          </p>
         <div className="hero-btns">
           <button
             className="primary-cta-btn"
             aria-label="Avukat Bul"
             onClick={() => navigate("/match")}
           >
             Avukat Bul
           </button>
         </div>
      </section>
      
      <section className="features-section">
        <div className="features-header">
          <h2>Özellikler</h2>
          <div className="features-underline" />
        </div>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Akıllı Eşleştirme</h3>
            <p>
              Gelişmiş yapay zeka eşleştirme algoritmasıyla davanız için en uygun avukatı kısa sürede önerir ve yönlendirir.
            </p>
          </div>
          <div className="feature-item">
            <h3>Uzman Havuzu</h3>
            <p>
              Her hukuk branşından deneyimli ve uzman avukatlarla çalışma fırsatı.
            </p>
          </div>
          <div className="feature-item">
            <h3>Hızlı İşlem</h3>
            <p>
              Modern ve kullanıcı dostu arayüz ile tüm işlemler hızlı ve pratiktir.
            </p>
          </div>
          <div className="feature-item">
            <h3>Güvenli Platform</h3>
            <p>
              Güvenlik ve gizlilik standartlarına uygun, güvenilir süreç yönetimi.
            </p>
          </div>
          <div className="feature-item">
            <h3>Analitik Raporlar</h3>
            <p>
              Detaylı istatistikler ve raporlamalar ile süreçlerinizi ölçün ve iyileştirin.
            </p>
          </div>
          <div className="feature-item">
            <h3>Kolay Yönetim</h3>
            <p>
              Dava ve avukat bilgilerini kolayca yönetin, güncelleyin ve organize edin.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
