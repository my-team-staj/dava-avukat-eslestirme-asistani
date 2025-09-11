import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LawyerDetailModal from './LawyerDetailModal';
import MatchConfirmationModal from './MatchConfirmationModal';
import apiClient, { API_CONFIG, getChoicesByCaseSafe } from '../config/api';
import "../App.css";

const yearsFrom = (iso) => {
  if (!iso) return 0;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  let y = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  const dd = now.getDate() - d.getDate();
  if (m < 0 || (m === 0 && dd < 0)) y -= 1;
  return Math.max(0, y);
};

const MatchPage = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topK, setTopK] = useState(3);
  const [selectedLawyerId, setSelectedLawyerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [filterScore, setFilterScore] = useState(80);
  const [sortBy, setSortBy] = useState('score'); // 'score' | 'experience'
  const [viewMode, setViewMode] = useState('cards');
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  const [lawyerNamesById, setLawyerNamesById] = useState({});
  const [lawyerDetailsById, setLawyerDetailsById] = useState({});
  const [history, setHistory] = useState([]);
  const [availableLawyers, setAvailableLawyers] = useState([]);
  const [availableLawyersCount, setAvailableLawyersCount] = useState(0);
  const [showAvailableLawyers, setShowAvailableLawyers] = useState(false);
  const [loadingAvailableLawyers, setLoadingAvailableLawyers] = useState(false);

  // ---- Skor yardımcıları ----
  const pickScore01 = (obj) => {
    const candidates = [obj?.score, obj?.totalScore, obj?.matchScore, obj?.scoreValue, obj?.confidence, obj?.probability];
    let raw = candidates.find(v => v !== undefined && v !== null);
    if (raw === undefined || raw === null) return 0;
    if (typeof raw === "string") raw = parseFloat(raw.replace(",", "."));
    if (Number.isNaN(raw)) return 0;
    if (raw > 1 && raw <= 100) return Math.max(0, Math.min(1, raw / 100));
    if (raw >= 0 && raw <= 1) return raw;
    return Math.max(0, Math.min(1, raw));
  };
  const readScore = (m) => {
    const s = typeof m?.score === 'number' ? m.score : pickScore01(m);
    return Number.isFinite(s) ? s : 0;
  };

  useEffect(() => { fetchAllCases(); }, []);
  useEffect(() => { if (selectedCase) fetchHistory(selectedCase); }, [selectedCase]);
  useEffect(() => { if (selectedCase) fetchAvailableLawyers(); }, [selectedCase]);

  // 🔥 Tüm davaları topla
  const fetchAllCases = async () => {
    try {
      const collected = [];
      let page = 1;
      const pageSize = 50;
      let totalPages = 1;

      do {
        const res = await apiClient.get(API_CONFIG.ENDPOINTS.CASES, {
          params: { page, pageSize, sortBy: "filesubject", sortOrder: "desc" }
        });

        const data = res?.data;
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
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Davalar yüklenirken hata oluştu');
      setCases([]);
    }
  };

  // Avukat isimleri/ayrıntıları
  const ensureLawyerNames = async (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return;
    const ids = [...new Set(arr.map(m => (m && (m.lawyerId ?? m.lawyerID ?? m.lawyer?.id))).filter(Boolean))];
    const toFetch = ids.filter(id => !lawyerNamesById[id]);
    if (toFetch.length === 0) return;

    try {
      const pairs = await Promise.all(
        toFetch.map(id =>
          apiClient
            .get(`${API_CONFIG.ENDPOINTS.LAWYERS}/${id}`)
            .then(r => [id, r.data?.fullName || `#${id}`])
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

  const ensureLawyerDetails = async (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return;
    const ids = [...new Set(arr.map(m => (m && (m.lawyerId ?? m.lawyerID ?? m.lawyer?.id))).filter(Boolean))];
    const toFetch = ids.filter(id => !lawyerDetailsById[id]);
    if (toFetch.length === 0) return;

    try {
      const pairs = await Promise.all(
        toFetch.map(id =>
          apiClient
            .get(`${API_CONFIG.ENDPOINTS.LAWYERS}/${id}`)
            .then(r => [id, r.data])
            .catch(() => [id, null])
        )
      );
      const next = { ...lawyerDetailsById };
      for (const [id, details] of pairs) {
        if (details) next[id] = details;
      }
      setLawyerDetailsById(next);
    } catch (e) {
      console.warn('Lawyer details fetch warning:', e);
    }
  };

  // Tarihçe
  const normalizeHistoryList = (list, caseId) => {
    const safe = Array.isArray(list) ? list : [];
    const normalized = safe.map((x, i) => {
      const lawyerId = x?.lawyerId ?? x?.lawyerID ?? x?.lawyer?.id ?? x?.lawyer?.lawyerId ?? null;
      const score = pickScore01(x);
      const matchedAt = x?.matchedAt || x?.createdAt || x?.date || x?.timestamp || new Date().toISOString();
      return {
        id: x?.id ?? x?._id ?? `${caseId}-${lawyerId ?? 'na'}-${i}`,
        caseId: x?.caseId ?? x?.caseID ?? caseId,
        lawyerId,
        score,
        matchedAt,
      };
    });
    normalized.sort((a, b) => new Date(b.matchedAt || 0) - new Date(a.matchedAt || 0));
    return normalized;
  };

  const fetchHistory = async (caseId) => {
    try {
      const list = await getChoicesByCaseSafe(caseId);
      const normalized = normalizeHistoryList(list, caseId);
      setHistory(normalized);
      ensureLawyerNames(normalized);
    } catch (err) {
      console.error(err);
      toast.error("Eşleştirme Geçmişi yüklenemedi");
      setHistory([]);
    }
  };

  // Uygun avukatlar (şehir bazlı)
  const fetchAvailableLawyers = async () => {
    if (!selectedCase) return;
    setLoadingAvailableLawyers(true);
    try {
      const caseData = cases.find(c => (c.id ?? c.Id) === selectedCase);
      if (!caseData) return;

      const city = caseData.city ?? caseData.City ?? "";
      const params = { page: 1, pageSize: 100, isActive: true, city };

      const response = await apiClient.get(API_CONFIG.ENDPOINTS.LAWYERS, { params });
      const arr = response.data?.items || [];
      const filtered = arr.filter(l => !city || l.city === city);

      setAvailableLawyers(filtered);
      setAvailableLawyersCount(filtered.length);
    } catch (error) {
      console.error('Uygun avukatlar alınırken hata:', error);
      setAvailableLawyers([]);
      setAvailableLawyersCount(0);
    } finally {
      setLoadingAvailableLawyers(false);
    }
  };

  const handleMatch = async () => {
    if (!selectedCase) { toast.warning('Lütfen bir dava seçin'); return; }
    setMatches([]);
    setLoading(true);
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.MATCH, { caseId: selectedCase, topK });
      const payload = response.data;
      const list = payload?.candidates && Array.isArray(payload.candidates) ? payload.candidates
                 : Array.isArray(payload) ? payload : [];
      setMatches(list);
      ensureLawyerNames(list);
      ensureLawyerDetails(list);
      toast.success(`${list.length} avukat önerildi`);
    } catch (error) {
      toast.error('Eşleştirme yapılırken hata oluştu');
      console.error('Error during matching:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChoose = (match) => {
    if (!selectedCase) { toast.warning('Lütfen bir dava seçin'); return; }
    if (!match?.lawyerId) { toast.warning('Avukat bulunamadı'); return; }
    setSelectedMatch(match);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmMatch = async (payload) => {
    try {
      setHistory(prev => [
        { id: `tmp-${Date.now()}`, caseId: payload.caseId, lawyerId: payload.lawyerId, score: payload.score, matchedAt: new Date().toISOString() },
        ...prev
      ]);
      fetchHistory(selectedCase);
    } catch (err) {
      console.error('Tarihçe güncelleme hatası:', err);
    }
  };

  const handleCloseConfirmationModal = () => { setIsConfirmationModalOpen(false); setSelectedMatch(null); };
  useEffect(() => { if (!isConfirmationModalOpen) setSelectedMatch(null); }, [isConfirmationModalOpen]);

  const getScoreColor = (score) => (score >= 0.8 ? 'var(--success)' : score >= 0.6 ? 'var(--warning)' : 'var(--error)');
  const getScoreText = (score) => (score >= 0.9 ? 'Süper' : score >= 0.8 ? 'Mükemmel' : score >= 0.7 ? 'Çok İyi' : score >= 0.6 ? 'İyi' : score >= 0.5 ? 'Orta' : 'Düşük');
  const getScoreLevel = (score) => {
    if (score >= 0.9) return { level: 'Süper', icon: '🏆', color: '#ffffff' };
    if (score >= 0.8) return { level: 'Mükemmel', icon: '⭐', color: '#ffffff' };
    if (score >= 0.7) return { level: 'Çok İyi', icon: '👍', color: '#ffffff' };
    if (score >= 0.6) return { level: 'İyi', icon: '✅', color: '#ffffff' };
    if (score >= 0.5) return { level: 'Orta', icon: '⚠️', color: '#ffffff' };
    return { level: 'Düşük', icon: '❌', color: 'var(--error)' };
  };

  const handleLawyerDetails = (lawyerId) => { setSelectedLawyerId(lawyerId); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setSelectedLawyerId(null); };
  const lawyerName = (id) => (id ? (lawyerNamesById[id] ?? `#${id}`) : 'Bilinmiyor');

  // Match listesi görünümü (yeni: deneyimi details’tan)
  const expOf = (lawyerId) => yearsFrom(lawyerDetailsById[lawyerId]?.startDate);

  const filteredAndSortedMatches = Array.isArray(matches) ? matches
    .filter(match => match && readScore(match) >= filterScore / 100)
    .sort((a, b) => (sortBy === 'experience'
      ? expOf(b.lawyerId) - expOf(a.lawyerId)
      : (readScore(b)) - (readScore(a)))) : [];

  const getScoreBreakdown = (match) => {
    const s = readScore(match);
    const expBonus = Math.min(expOf(match.lawyerId) * 0.02, 0.1);
    const langBonus = 0.05; // görsel
    const cityBonus = 0.03; // görsel
    return {
      baseScore: s - expBonus - langBonus - cityBonus,
      experienceBonus: expBonus,
      ratingBonus: 0,
      languageBonus: langBonus,
      cityBonus,
      total: s
    };
  };

  // Seçilen dava bilgileri
  const sel = selectedCase ? cases.find(c => (c.id ?? c.Id) === selectedCase) : null;
  const fileSubject = sel?.fileSubject ?? sel?.FileSubject ?? "";
  const city = sel?.city ?? sel?.City ?? "";
  // const caseResponsible = sel?.caseResponsible ?? sel?.CaseResponsible ?? "";  // ❌ KARTTA KULLANMIYORUZ
  const contactClient = sel?.contactClient ?? sel?.ContactClient ?? "";
  const isToBeInvoiced = (sel?.isToBeInvoiced ?? sel?.IsToBeInvoiced) ? "Evet" : "Hayır";
  const description = sel?.description ?? sel?.Description ?? "";
  const subjectMatterDescription = sel?.subjectMatterDescription ?? sel?.SubjectMatterDescription ?? "";
  const addressLine = [sel?.address ?? sel?.Address, sel?.county ?? sel?.County, sel?.country ?? sel?.Country]
    .filter(Boolean).join(" ");

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
              value={selectedCase ?? ''}
              onChange={(e) => { const v = e.target.value; setSelectedCase(v ? Number(v) : null); }}
              className="form-select"
            >
              <option value="">Dava seçin...</option>
              {Array.isArray(cases) && cases.map((caseItem) => (
                <option key={caseItem.id ?? caseItem.Id} value={caseItem.id ?? caseItem.Id}>
                  {(caseItem.fileSubject ?? caseItem.FileSubject ?? "(Konusuz)")}{(caseItem.city ?? caseItem.City) ? ` - ${caseItem.city ?? caseItem.City}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="topK">Öneri Sayısı:</label>
            <div className="inline-control">
              <select id="topK" value={topK} onChange={(e) => setTopK(Number(e.target.value))} className="form-select">
                <option value={3}>3 Avukat</option>
                <option value={5}>5 Avukat</option>
                <option value={10}>10 Avukat</option>
              </select>
              <button onClick={handleMatch} disabled={!selectedCase || loading} className="match-button">
                {loading ? 'Eşleştirme Önerileri Yapılıyor' : 'Eşleştirme Önerileri Al'}
              </button>
            </div>
          </div>
        </div>

        {matches.length > 0 && (
          <div className="matches-results">
            <h2>Eşleştirme Sonuçları</h2>

            {/* Seçilen Dava Bilgileri */}
            <div className="selected-case-info">
              <h3>Seçilen Dava</h3>
              <div className="case-details">
                <div className="case-detail-item"><strong>Dosya Konusu:</strong> {fileSubject}</div>
                <div className="case-detail-item"><strong>Şehir:</strong> {city}</div>
                {/* ❌ “Sorumlu” alanı istenmediği için kaldırıldı */}
                <div className="case-detail-item"><strong>Müvekkil:</strong> {contactClient || "-"}</div>
                <div className="case-detail-item"><strong>Faturalandırılacak mı?</strong> {isToBeInvoiced}</div>
              </div>
            </div>

            {/* Uygun Avukatlar (şehir bazlı) */}
            <div className="available-lawyers-section">
              <div className="available-lawyers-header">
                <div className="lawyers-count">
                  {loadingAvailableLawyers ? (
                    <span className="loading-text">Uygun avukatlar kontrol ediliyor...</span>
                  ) : availableLawyersCount > 0 ? (
                    <span className="count-text"><strong>{availableLawyersCount}</strong> avukat bulundu</span>
                  ) : (
                    <span className="no-lawyers-text">Bu dava için kriterlere uyan avukat bulunamadı</span>
                  )}
                </div>
                {availableLawyersCount > 0 && (
                  <button className="toggle-lawyers-btn" onClick={() => setShowAvailableLawyers(!showAvailableLawyers)}>
                    {showAvailableLawyers ? '🔼 Gizle' : '🔽 Göster'}
                  </button>
                )}
              </div>

              {showAvailableLawyers && availableLawyersCount > 0 && (
                <div className="available-lawyers-list">
                  <div className="lawyers-list-header">
                    <h4>Uygun Avukatlar</h4>
                    <span className="lawyers-count-badge">{availableLawyersCount} avukat</span>
                  </div>
                  <div className="lawyers-grid">
                    {availableLawyers.map((lawyer, index) => {
                      const exp = yearsFrom(lawyer.startDate);
                      return (
                        <div key={lawyer.id || index} className="lawyer-card-mini">
                          <div className="lawyer-info">
                            <div className="lawyer-name">{lawyer.fullName}</div>
                            <div className="lawyer-details">
                              <span className="lawyer-city">📍 {lawyer.city}</span>
                              <span className="lawyer-experience">⚖️ {exp} yıl</span>
                              {lawyer.title && <span className="pro-bono-badge">{lawyer.title}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sonuç Kontrolleri */}
            <div className="results-header">
              <div className="view-controls">
                <button className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`} onClick={() => setViewMode('cards')}>📋 Kart Görünümü</button>
                <button className={`view-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>📊 Tablo Görünümü</button>
              </div>

              <div className="filter-controls">
                <div className="filter-group">
                  <label style={{ marginRight: 8 }}>Sırala:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-select">
                    <option value="score">Skor</option>
                    <option value="experience">Deneyim</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label htmlFor="filterScore">Min. Skor: {filterScore}%</label>
                  <input type="range" id="filterScore" min="0" max="100" value={filterScore}
                         onChange={(e) => setFilterScore(Number(e.target.value))} className="score-slider" />
                </div>
              </div>

              <button className="score-breakdown-toggle" onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}>
                {showScoreBreakdown ? '🔽 Skor Detayını Gizle' : '🔼 Skor Detayını Göster'}
              </button>
            </div>

            {/* İstatistikler / Kart / Tablo */}
            <div className="match-stats">
              <div className="stat-item"><span className="stat-label">Toplam Sonuç:</span><span className="stat-value">{filteredAndSortedMatches.length}</span></div>
              <div className="stat-item"><span className="stat-label">Ortalama Skor:</span>
                <span className="stat-value">
                  {filteredAndSortedMatches.length > 0
                    ? (filteredAndSortedMatches.reduce((s, m) => s + readScore(m), 0) / filteredAndSortedMatches.length).toFixed(2)
                    : '0.00'}
                </span>
              </div>
              <div className="stat-item"><span className="stat-label">En Yüksek Skor:</span>
                <span className="stat-value">
                  {filteredAndSortedMatches.length > 0
                    ? Math.max(...filteredAndSortedMatches.map(m => readScore(m))).toFixed(2)
                    : '0.00'}
                </span>
              </div>
              <div className="stat-item"><span className="stat-label">En Düşük Skor:</span>
                <span className="stat-value">
                  {filteredAndSortedMatches.length > 0
                    ? Math.min(...filteredAndSortedMatches.map(m => readScore(m))).toFixed(2)
                    : '0.00'}
                </span>
              </div>
            </div>

            {viewMode === 'cards' && (
              <div className="matches-grid">
                {filteredAndSortedMatches.map((match, index) => {
                  const s = readScore(match);
                  return (
                    <div key={match.lawyerId || index} className="match-card">
                      <div className="match-header">
                        <span className="match-rank">#{index + 1}</span>
                        <div className="match-score">
                          <div className="score-circle">
                            <span className="score-number">{s.toFixed(2)}</span>
                            <svg className="score-ring" viewBox="0 0 36 36">
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke={getScoreColor(s)} strokeWidth="3"
                                    strokeDasharray={`${(s * 100).toFixed(0)}, 100`}
                                    strokeLinecap="round" />
                            </svg>
                          </div>
                          <span className="score-text">{getScoreText(s)}</span>
                        </div>
                      </div>

                      <div className="match-content">
                        <h3>Avukat: {lawyerName(match.lawyerId)}</h3>
                        <p className="match-reason">{match.reason || 'Sebep belirtilmemiş'}</p>
                        <div className="score-level">
                          {(() => { const level = getScoreLevel(s);
                            return <span style={{ color: level.color }}>{level.icon} {level.level}</span>; })()}
                        </div>
                      </div>

                      <div className="match-actions">
                        <button className="btn-details" onClick={() => handleLawyerDetails(match.lawyerId)} disabled={!match.lawyerId}>
                          Detayları Gör
                        </button>
                        <button className="primary-btn" onClick={() => handleChoose(match)}
                                disabled={!selectedCase || !match.lawyerId} style={{ marginLeft: 8 }}>
                          Bu Avukatı Eşleştir
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'table' && (
              <div className="matches-table-container">
                <table className="matches-table">
                  <thead>
                    <tr><th>Sıra</th><th>Avukat</th><th>Skor</th><th>Seviye</th><th>Sebep</th><th>İşlemler</th></tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedMatches.map((match, index) => {
                      const s = readScore(match);
                      const level = getScoreLevel(s);
                      return (
                        <tr key={match.lawyerId || index}>
                          <td className="rank-cell">#{index + 1}</td>
                          <td className="lawyer-id-cell">{lawyerName(match.lawyerId)}</td>
                          <td className="score-cell">
                            <div className="table-score">
                              <span className="score-value">{s.toFixed(2)}</span>
                              <div className="score-bar"><div className="score-fill" style={{ width: `${s * 100}%`, backgroundColor: getScoreColor(s) }} /></div>
                            </div>
                          </td>
                          <td className="level-cell"><span style={{ color: level.color }}>{level.icon} {level.level}</span></td>
                          <td className="reason-cell">{match.reason || 'Sebep belirtilmemiş'}</td>
                          <td className="actions-cell">
                            <button className="btn-details-small" onClick={() => handleLawyerDetails(match.lawyerId)} disabled={!match.lawyerId}>Detay</button>
                            <button className="primary-btn small" onClick={() => handleChoose(match)} disabled={!selectedCase || !match.lawyerId} style={{ marginLeft: 8 }}>Eşleştir</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {showScoreBreakdown && (
              <div className="score-breakdown-section">
                <h3>📊 Detaylı Skor Analizi</h3>
                <div className="breakdown-grid">
                  {filteredAndSortedMatches.slice(0, 3).map((match, index) => {
                    const s = readScore(match);
                    const b = getScoreBreakdown({ ...match, score: s });
                    return (
                      <div key={match.lawyerId || index} className="breakdown-card">
                        <h4>#{index + 1} - {lawyerName(match.lawyerId)}</h4>
                        <div className="breakdown-details">
                          <div className="breakdown-item"><span>Ana Skor:</span><span>{(b.baseScore * 100).toFixed(1)}%</span></div>
                          <div className="breakdown-item"><span>Deneyim Bonusu:</span><span className="positive">+{(b.experienceBonus * 100).toFixed(1)}%</span></div>
                          <div className="breakdown-item"><span>Dil Uyumu:</span><span className="positive">+{(b.languageBonus * 100).toFixed(1)}%</span></div>
                          <div className="breakdown-item"><span>Şehir Uyumu:</span><span className="positive">+{(b.cityBonus * 100).toFixed(1)}%</span></div>
                          <div className="breakdown-item total"><span>Toplam:</span><span>{(b.total * 100).toFixed(1)}%</span></div>
                        </div>
                      </div>
                    );
                  })}
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
          <div className="available-lawyers-preview">
            <div className="available-lawyers-section">
              <div className="available-lawyers-header">
                <div className="lawyers-count">
                  {loadingAvailableLawyers ? (
                    <span className="loading-text">Uygun avukatlar kontrol ediliyor...</span>
                  ) : availableLawyersCount > 0 ? (
                    <span className="count-text"><strong>{availableLawyersCount}</strong> avukat bulundu</span>
                  ) : (
                    <span className="no-lawyers-text">Bu dava için kriterlere uyan avukat bulunamadı</span>
                  )}
                </div>
                {availableLawyersCount > 0 && (
                  <button className="toggle-lawyers-btn" onClick={() => setShowAvailableLawyers(!showAvailableLawyers)}>
                    {showAvailableLawyers ? '🔼 Gizle' : '🔽 Göster'}
                  </button>
                )}
              </div>

              {showAvailableLawyers && availableLawyersCount > 0 && (
                <div className="available-lawyers-list">
                  <div className="lawyers-list-header">
                    <h4>Uygun Avukatlar</h4>
                    <span className="lawyers-count-badge">{availableLawyersCount} avukat</span>
                  </div>
                  <div className="lawyers-grid">
                    {availableLawyers.map((lawyer, index) => {
                      const exp = yearsFrom(lawyer.startDate);
                      return (
                        <div key={lawyer.id || index} className="lawyer-card-mini">
                          <div className="lawyer-info">
                            <div className="lawyer-name">{lawyer.fullName}</div>
                            <div className="lawyer-details">
                              <span className="lawyer-city">📍 {lawyer.city}</span>
                              <span className="lawyer-experience">⚖️ {exp} yıl</span>
                              {lawyer.title && (<span className="pro-bono-badge">{lawyer.title}</span>)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedCase && matches.length === 0 && !loading && (
          <div className="match-placeholder">
            <div className="placeholder-icon">⚖️</div>
            <h3>Eşleştirme Önerisi Yapılmadı</h3>
            <p>Seçilen dava için eşleştirme önerisi almak üzere "Eşleştirme Önerileri Al" butonuna tıklayınız.</p>
          </div>
        )}

        {loading && matches.length === 0 && (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>AI eşleştirme yapılıyor...</p>
              <p className="loading-subtitle">Bu işlem birkaç saniye sürebilir</p>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Eşleştirme Tarihçesi */}
      {selectedCase && (
        <div className="history-section">
          <h3>Mevcut Eşleştirme Kaydı</h3>
          {history.length === 0 ? (
            <div className="empty">Bu dava için henüz kayıtlı eşleştirme yok.</div>
          ) : (
            <div className="history-list">
              {history.map(h => (
                <div key={h.id} className="history-item">
                  <div className="left">
                    <strong>{lawyerName(h.lawyerId)}</strong>
                    <div className="muted">{new Date(h.matchedAt ?? h.createdAt ?? Date.now()).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <LawyerDetailModal lawyerId={selectedLawyerId} isOpen={isModalOpen} onClose={closeModal} />

      <MatchConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        caseData={sel ? {
          id: sel.id ?? sel.Id,
          fileSubject,
          city,
          // caseResponsible alanı burada kalabilir; modalda kullanılmak istenirse backend kaydı için gerekli olabilir
          caseResponsible: sel?.caseResponsible ?? sel?.CaseResponsible ?? "",
          contactClient,
          isToBeInvoiced: (sel?.isToBeInvoiced ?? sel?.IsToBeInvoiced) === true,
          description,
          subjectMatterDescription,
          address: addressLine
        } : null}
        lawyerData={selectedMatch ? {
          lawyerId: selectedMatch.lawyerId,
          name: lawyerNamesById[selectedMatch.lawyerId] ?? `#${selectedMatch.lawyerId}`,
          city: lawyerDetailsById[selectedMatch.lawyerId]?.city || 'Belirtilmemiş',
          workingGroup: lawyerDetailsById[selectedMatch.lawyerId]?.workGroup
            || lawyerDetailsById[selectedMatch.lawyerId]?.workingGroup?.groupName
            || 'Belirtilmemiş',
          score: readScore(selectedMatch)
        } : null}
        onSuccess={handleConfirmMatch}
      />
    </div>
  );
};

export default MatchPage;
