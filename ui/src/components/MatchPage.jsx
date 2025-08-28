import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LawyerDetailModal from './LawyerDetailModal';
import apiClient, { API_CONFIG } from '../config/api';
import "../App.css";

const MatchPage = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topK, setTopK] = useState(3);
  const [selectedLawyerId, setSelectedLawyerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterScore, setFilterScore] = useState(80);
  const [sortBy, setSortBy] = useState('score');
  const [viewMode, setViewMode] = useState('cards');
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  // 🔹 ID -> İsim sözlüğü (cache)
  const [lawyerNamesById, setLawyerNamesById] = useState({});

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.CASES);
      console.log('API Response:', response.data);

      if (response.data && Array.isArray(response.data)) {
        setCases(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setCases(response.data.data);
      } else if (response.data && response.data.items && Array.isArray(response.data.items)) {
        setCases(response.data.items);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setCases([]);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Davalar yüklenirken hata oluştu');
      setCases([]);
    }
  };

  // 🔹 Avukat isimlerini ID'lerden toplayan yardımcı
  const ensureLawyerNames = async (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return;

    const ids = [...new Set(arr.map(m => m && m.lawyerId).filter(Boolean))];
    const toFetch = ids.filter(id => !lawyerNamesById[id]);
    if (toFetch.length === 0) return;

    try {
      const pairs = await Promise.all(
        toFetch.map(id =>
          apiClient
            .get(`${API_CONFIG.ENDPOINTS.LAWYERS}/${id}`)
            .then(r => [id, r.data?.name || `#${id}`])
            .catch(() => [id, `#${id}`])
        )
      );
      const next = { ...lawyerNamesById };
      for (const [id, name] of pairs) next[id] = name;
      setLawyerNamesById(next);
    } catch (e) {
      console.warn('Lawyer names fetch warning:', e);
    }
  };

  const handleMatch = async () => {
    if (!selectedCase) {
      toast.warning('Lütfen bir dava seçin');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.MATCH, {
        caseId: selectedCase,
        topK: topK
      });

      console.log('Match Response:', response.data);

      if (response.data && response.data.candidates && Array.isArray(response.data.candidates)) {
        setMatches(response.data.candidates);
        // 🔹 İsimleri yükle
        ensureLawyerNames(response.data.candidates);
        toast.success(`${response.data.candidates.length} avukat eşleştirildi`);
      } else if (response.data && Array.isArray(response.data)) {
        setMatches(response.data);
        // 🔹 İsimleri yükle
        ensureLawyerNames(response.data);
        toast.success(`${response.data.length} avukat eşleştirildi`);
      } else {
        console.warn('Unexpected match response structure:', response.data);
        setMatches([]);
        toast.warning('Eşleştirme sonucu beklenmeyen formatta');
      }
    } catch (error) {
      toast.error('Eşleştirme yapılırken hata oluştu');
      console.error('Error during matching:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return '#28a745';
    if (score >= 0.6) return '#ffc107';
    return '#dc3545';
  };

  const getScoreText = (score) => {
    if (score >= 0.8) return 'Mükemmel';
    if (score >= 0.6) return 'İyi';
    return 'Orta';
  };

  const getScoreLevel = (score) => {
    if (score >= 0.9) return { level: 'Süper', icon: '🏆', color: '#28a745' };
    if (score >= 0.8) return { level: 'Mükemmel', icon: '⭐', color: '#28a745' };
    if (score >= 0.7) return { level: 'Çok İyi', icon: '👍', color: '#20c997' };
    if (score >= 0.6) return { level: 'İyi', icon: '✅', color: '#ffc107' };
    if (score >= 0.5) return { level: 'Orta', icon: '⚠️', color: '#fd7e14' };
    return { level: 'Düşük', icon: '❌', color: '#dc3545' };
  };

  const handleLawyerDetails = (lawyerId) => {
    setSelectedLawyerId(lawyerId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLawyerId(null);
  };

  // Filtrelenmiş ve sıralanmış sonuçlar
  const filteredAndSortedMatches = Array.isArray(matches) ? matches
    .filter(match => match && match.score && match.score >= filterScore / 100)
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'experience':
          return (b.experienceYears || 0) - (a.experienceYears || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return b.score - a.score;
      }
    }) : [];

  const getScoreBreakdown = (match) => {
    if (!match || typeof match.score !== 'number') {
      return {
        baseScore: 0,
        experienceBonus: 0,
        ratingBonus: 0,
        languageBonus: 0,
        cityBonus: 0,
        total: 0
      };
    }

    const baseScore = match.score;
    const experienceBonus = Math.min((match.experienceYears || 0) * 0.02, 0.1);
    const ratingBonus = Math.min((match.rating || 0) * 0.1, 0.1);
    const languageBonus = 0.05; // Dil uyumu (örnek)
    const cityBonus = 0.03;      // Şehir uyumu (örnek)

    return {
      baseScore: baseScore - experienceBonus - ratingBonus - languageBonus - cityBonus,
      experienceBonus,
      ratingBonus,
      languageBonus,
      cityBonus,
      total: baseScore
    };
  };

  // 🔹 Yardımcı: ID -> İsim
  const lawyerName = (id) => (id ? (lawyerNamesById[id] ?? `#${id}`) : 'Bilinmiyor');

  return (
    <div className="match-page">
      <div className="match-header">
        <h1>Dava-Avukat Eşleştirme</h1>
        <p>AI destekli akıllı eşleştirme sistemi ile en uygun avukatı bulun</p>
      </div>

      <div className="match-container">
        <div className="match-controls">
          <div className="control-group">
            <label htmlFor="caseSelect">Dava Seçin:</label>
            <select
              id="caseSelect"
              value={selectedCase || ''}
              onChange={(e) => setSelectedCase(Number(e.target.value))}
              className="form-select"
            >
              <option value="">Dava seçin...</option>
              {Array.isArray(cases) && cases.map((caseItem) => (
                <option key={caseItem.id} value={caseItem.id}>
                  {caseItem.title} - {caseItem.city}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="topK">Öneri Sayısı:</label>
            <select
              id="topK"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="form-select"
            >
              <option value={3}>3 Avukat</option>
              <option value={5}>5 Avukat</option>
              <option value={10}>10 Avukat</option>
            </select>
          </div>

          <button
            onClick={handleMatch}
            disabled={!selectedCase || loading}
            className="match-button"
          >
            {loading ? 'Eşleştiriliyor...' : 'Eşleştir'}
          </button>
        </div>

        {matches.length > 0 && (
          <div className="matches-results">
            <h2>Eşleştirme Sonuçları</h2>

            {/* Seçilen Dava Bilgileri */}
            <div className="selected-case-info">
              <h3>Seçilen Dava</h3>
              <div className="case-details">
                <div className="case-detail-item">
                  <strong>Başlık:</strong> {Array.isArray(cases) ? cases.find(c => c.id === selectedCase)?.title : ''}
                </div>
                <div className="case-detail-item">
                  <strong>Şehir:</strong> {Array.isArray(cases) ? cases.find(c => c.id === selectedCase)?.city : ''}
                </div>
                <div className="case-detail-item">
                  <strong>Dil:</strong> {Array.isArray(cases) ? cases.find(c => c.id === selectedCase)?.language : ''}
                </div>
                <div className="case-detail-item">
                  <strong>Acil Seviye:</strong> {Array.isArray(cases) ? cases.find(c => c.id === selectedCase)?.urgencyLevel : ''}
                </div>
                <div className="case-detail-item">
                  <strong>Pro Bono:</strong> {Array.isArray(cases) ? (cases.find(c => c.id === selectedCase)?.requiresProBono ? 'Evet' : 'Hayır') : ''}
                </div>
              </div>
            </div>

            {/* Gelişmiş Sonuç Kontrolleri */}
            <div className="results-header">
              <div className="view-controls">
                <button
                  className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                  onClick={() => setViewMode('cards')}
                >
                  📋 Kart Görünümü
                </button>
                <button
                  className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                >
                  📊 Tablo Görünümü
                </button>
              </div>

              <div className="filter-controls">
                <div className="filter-group">
                  
                 
                </div>

                <div className="filter-group">
                  <label htmlFor="filterScore">Min. Skor: {filterScore}%</label>
                  <input
                    type="range"
                    id="filterScore"
                    min="0"
                    max="100"
                    value={filterScore}
                    onChange={(e) => setFilterScore(Number(e.target.value))}
                    className="score-slider"
                  />
                </div>
              </div>

              <button
                className="score-breakdown-toggle"
                onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
              >
                {showScoreBreakdown ? '🔽 Skor Detayını Gizle' : '🔼 Skor Detayını Göster'}
              </button>
            </div>

            {/* Eşleştirme İstatistikleri */}
            <div className="match-stats">
              <div className="stat-item">
                <span className="stat-label">Toplam Sonuç:</span>
                <span className="stat-value">{filteredAndSortedMatches.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Ortalama Skor:</span>
                <span className="stat-value">
                  {filteredAndSortedMatches.length > 0 
                    ? (filteredAndSortedMatches.reduce((sum, m) => sum + (m.score || 0), 0) / filteredAndSortedMatches.length).toFixed(2)
                    : '0.00'
                  }
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">En Yüksek Skor:</span>
                <span className="stat-value">
                  {filteredAndSortedMatches.length > 0 
                    ? Math.max(...filteredAndSortedMatches.map(m => m.score || 0)).toFixed(2)
                    : '0.00'
                  }
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">En Düşük Skor:</span>
                <span className="stat-value">
                  {filteredAndSortedMatches.length > 0 
                    ? Math.min(...filteredAndSortedMatches.map(m => m.score || 0)).toFixed(2)
                    : '0.00'
                  }
                </span>
              </div>
            </div>

            {/* Kart Görünümü */}
            {viewMode === 'cards' && (
              <div className="matches-grid">
                {filteredAndSortedMatches.map((match, index) => (
                  <div key={match.lawyerId || index} className="match-card">
                    <div className="match-header">
                      <span className="match-rank">#{index + 1}</span>
                      <div className="match-score">
                        <div className="score-circle">
                          <span className="score-number">{(match.score || 0).toFixed(2)}</span>
                          <svg className="score-ring" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke={getScoreColor(match.score || 0)}
                              strokeWidth="3"
                              strokeDasharray={`((match.score || 0) * 100), 100`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <span className="score-text">{getScoreText(match.score || 0)}</span>
                      </div>
                    </div>

                    <div className="match-content">
                      {/* 🔹 ID yerine ad göster */}
                      <h3>Avukat: {lawyerName(match.lawyerId)}</h3>
                      <p className="match-reason">{match.reason || 'Sebep belirtilmemiş'}</p>

                      {/* Skor Seviyesi */}
                      <div className="score-level">
                        {(() => {
                          const level = getScoreLevel(match.score || 0);
                          return (
                            <span style={{ color: level.color }}>
                              {level.icon} {level.level}
                            </span>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="match-actions">
                      <button 
                        className="btn-details"
                        onClick={() => handleLawyerDetails(match.lawyerId)}
                        disabled={!match.lawyerId}
                      >
                        Detayları Gör
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tablo Görünümü */}
            {viewMode === 'table' && (
              <div className="matches-table-container">
                <table className="matches-table">
                  <thead>
                    <tr>
                      <th>Sıra</th>
                      {/* 🔹 Başlık: Avukat */}
                      <th>Avukat</th>
                      <th>Skor</th>
                      <th>Seviye</th>
                      <th>Sebep</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedMatches.map((match, index) => {
                      const level = getScoreLevel(match.score || 0);
                      return (
                        <tr key={match.lawyerId || index}>
                          <td className="rank-cell">#{index + 1}</td>
                          {/* 🔹 Hücre: İsim */}
                          <td className="lawyer-id-cell">{lawyerName(match.lawyerId)}</td>
                          <td className="score-cell">
                            <div className="table-score">
                              <span className="score-value">{(match.score || 0).toFixed(2)}</span>
                              <div className="score-bar">
                                <div 
                                  className="score-fill" 
                                  style={{ 
                                    width: `${(match.score || 0) * 100}%`,
                                    backgroundColor: getScoreColor(match.score || 0)
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="level-cell">
                            <span style={{ color: level.color }}>
                              {level.icon} {level.level}
                            </span>
                          </td>
                          <td className="reason-cell">{match.reason || 'Sebep belirtilmemiş'}</td>
                          <td className="actions-cell">
                            <button 
                              className="btn-details-small"
                              onClick={() => handleLawyerDetails(match.lawyerId)}
                              disabled={!match.lawyerId}
                            >
                              Detay
                            </button>
                            
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Skor Detayı */}
            {showScoreBreakdown && (
              <div className="score-breakdown-section">
                <h3>📊 Detaylı Skor Analizi</h3>
                <div className="breakdown-grid">
                  {filteredAndSortedMatches.slice(0, 3).map((match, index) => (
                    <div key={match.lawyerId || index} className="breakdown-card">
                      {/* 🔹 Başlıkta da isim */}
                      <h4>#{index + 1} - {lawyerName(match.lawyerId)}</h4>
                      <div className="breakdown-details">
                        {(() => {
                          const breakdown = getScoreBreakdown(match);
                          return (
                            <>
                              <div className="breakdown-item">
                                <span>Ana Skor:</span>
                                <span>{(breakdown.baseScore * 100).toFixed(1)}%</span>
                              </div>
                              <div className="breakdown-item">
                                <span>Deneyim Bonusu:</span>
                                <span className="positive">+{(breakdown.experienceBonus * 100).toFixed(1)}%</span>
                              </div>
                              <div className="breakdown-item">
                                <span>Puan Bonusu:</span>
                                <span className="positive">+{(breakdown.ratingBonus * 100).toFixed(1)}%</span>
                              </div>
                              <div className="breakdown-item">
                                <span>Dil Uyumu:</span>
                                <span className="positive">+{(breakdown.languageBonus * 100).toFixed(1)}%</span>
                              </div>
                              <div className="breakdown-item">
                                <span>Şehir Uyumu:</span>
                                <span className="positive">+{(breakdown.cityBonus * 100).toFixed(1)}%</span>
                              </div>
                              <div className="breakdown-item total">
                                <span>Toplam:</span>
                                <span>{(breakdown.total * 100).toFixed(1)}%</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!selectedCase && (
          <div className="match-placeholder">
            <div className="placeholder-icon">🔍</div>
            <h3>Eşleştirme Başlatın</h3>
            <p>Yukarıdan bir dava seçin ve eşleştirme işlemini başlatın</p>
          </div>
        )}

        {selectedCase && matches.length === 0 && !loading && (
          <div className="match-placeholder">
            <div className="placeholder-icon">⚖️</div>
            <h3>Eşleştirme Yapılmadı</h3>
            <p>Seçilen dava için eşleştirme yapmak üzere "Eşleştir" butonuna tıklayın</p>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>AI eşleştirme yapılıyor...</p>
              <p className="loading-subtitle">Bu işlem birkaç saniye sürebilir</p>
            </div>
          </div>
        )}
      </div>

      <LawyerDetailModal
        lawyerId={selectedLawyerId}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default MatchPage;
