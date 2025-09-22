import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import SearchableSelect from "./inputs/SearchableSelect";
import "../App.css";

function Home() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [topK, setTopK] = useState(3);
  const [loading, setLoading] = useState(false);

  // Dava listesini yükle (sayfalama ile tümünü al)
  useEffect(() => {
    const fetchAllCases = async () => {
      try {
        const collected = [];
        let page = 1;
        const pageSize = 50;
        let totalPages = 1;

        do {
          const response = await axios.get("https://localhost:60227/api/cases", {
            params: { page, pageSize, sortBy: "filesubject", sortOrder: "desc" }
          });

          const data = response?.data;
          const items = Array.isArray(data)
            ? data
            : Array.isArray(data?.items)
              ? data.items
              : Array.isArray(data?.data)
                ? data.data
                : [];

          totalPages = data?.totalPages ?? totalPages;
          collected.push(...items);
          page += 1;
        } while (page <= totalPages);

        setCases(collected);
        console.log(`Toplam ${collected.length} dava yüklendi`);
      } catch (error) {
        console.error("Dava listesi yüklenirken hata:", error);
        toast.error("Dava listesi yüklenirken hata oluştu");
        setCases([]);
      }
    };
    fetchAllCases();
  }, []);

  // Avukat önerileri al
  const handleGetSuggestions = async () => {
    if (!selectedCase) {
      toast.warning("Lütfen bir dava seçin");
      return;
    }

    setLoading(true);
    try {
      // Arka planda eşleştirme yap
      const response = await axios.post("https://localhost:60227/api/match/suggest", {
        caseId: parseInt(selectedCase),
        topK: topK
      });

      // Sonuçları localStorage'a kaydet
      const matches = response.data?.candidates || response.data || [];
      localStorage.setItem('quickMatchResults', JSON.stringify({
        matches: matches,
        caseId: selectedCase,
        count: matches.length,
        timestamp: Date.now()
      }));

      // Başarı mesajı göster
      toast.success(`${matches.length} avukat önerisi hazır!`);
      
      // Eşleştirme sonuçları sayfasına yönlendir
      navigate(`/match-results?caseId=${selectedCase}&count=${matches.length}&quickMatch=true`);
      
      // Form'u temizle
      setSelectedCase("");
      setTopK(3);
    } catch (error) {
      console.error("Eşleştirme hatası:", error);
      toast.error("Avukat önerileri alınırken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-hero-bg">
      <section className="hero-main">
          <div className="brand-logo-wrap" role="img" aria-label="lexpert">
            <img src="/lexpert-logo.svg" alt="lexpert" className="brand-logo" />
          </div>
          <p className="brand-slogan">
            Yapay zeka destekli akıllı eşleştirme sistemi ile en uygun avukatı saniyeler içinde bulun.
          </p>
          {/* Hızlı Eşleştirme Formu */}
          <div className="quick-match-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="caseSelect">Dava Seçin:</label>
                <select
                  id="caseSelect"
                  value={selectedCase}
                  onChange={(e) => setSelectedCase(e.target.value)}
                  className="form-select"
                >
                  <option value="">Dava seçin...</option>
                  {cases.map((caseItem) => (
                    <option key={caseItem.id} value={caseItem.id}>
                      {caseItem.fileSubject || caseItem.FileSubject || `Dava #${caseItem.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group--narrow">
                <label htmlFor="topKSelect">Öneri Sayısı:</label>
                <select
                  id="topKSelect"
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="form-select"
                >
                  <option value={3}>3 Avukat</option>
                  <option value={5}>5 Avukat</option>
                  <option value={10}>10 Avukat</option>
                </select>
              </div>
            </div>

            <button
              className={`primary-cta-btn ${loading ? 'loading' : ''}`}
              onClick={handleGetSuggestions}
              disabled={loading || !selectedCase}
              aria-label="Avukat Bul"
            >
              {loading ? (
                <>
                  <div className="loading-spinner-toast"></div>
                  Avukat Önerileri Hazırlanıyor...
                </>
              ) : (
                'Avukat Bul'
              )}
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
