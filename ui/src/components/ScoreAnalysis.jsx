// ui/src/components/ScoreAnalysis.jsx
import React from 'react';
import '../App.css';

/**
 * match: LLM sonucundaki aday
 *   - score (0..1)
 *   - experienceYears (number | undefined)
 *   - rating (0..5 | undefined)
 *   - city (string | undefined)
 *   - languages (string[] | string | undefined)  // varsa sadece görsel amaçlı
 *
 * caseData:
 *   - city (string | undefined)
 */
const ScoreAnalysis = ({ match = {}, caseData = {} }) => {
  const score = Number.isFinite(match?.score) ? match.score : 0;
  const expYears = Number.isFinite(match?.experienceYears) ? match.experienceYears : 0;
  const rating = Number.isFinite(match?.rating) ? match.rating : 0;
  const lawyerCity = match?.city || '';
  const caseCity = caseData?.city || '';

  // (Opsiyonel) languages string ise diziye çevir
  const toArray = (v) =>
    Array.isArray(v)
      ? v
      : typeof v === 'string'
      ? v.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  const languages = toArray(match?.languages);

  // --- Skor dağılımı (sadece mevcut alanlara göre) ---
  const getScoreBreakdown = () => {
    const base = score;

    // Deneyim katkısı (maks. +0.10)
    const experienceBonus = Math.min(expYears * 0.02, 0.10);

    // Rating katkısı (0..5 => maks. +0.10)
    const ratingBonus = Math.min(Math.max(rating, 0) * 0.02, 0.10);

    // Şehir uyumu (aynı şehir +0.03)
    const cityBonus = caseCity && lawyerCity && caseCity === lawyerCity ? 0.03 : 0.0;

    return {
      baseScore: Math.max(
        0,
        base - experienceBonus - ratingBonus - cityBonus // görsel amaçlı ayrıştırma
      ),
      experienceBonus,
      ratingBonus,
      cityBonus,
      total: base,
    };
  };

  const breakdown = getScoreBreakdown();

  // --- Faktör kartları (bilgi amaçlı) ---
  const factors = [
    {
      name: 'Deneyim',
      value:
        expYears >= 10 ? 'Çok Yüksek' :
        expYears >= 5  ? 'Yüksek' :
        expYears >= 2  ? 'Orta' : 'Düşük',
      score:
        expYears >= 10 ? '+10%' :
        expYears >= 5  ? '+7%'  :
        expYears >= 2  ? '+4%'  : '+1%',
      color:
        expYears >= 10 ? '#28a745' :
        expYears >= 5  ? '#20c997' :
        expYears >= 2  ? '#ffc107' : '#fd7e14',
    },
    {
      name: 'Müşteri Puanı',
      value:
        rating >= 4.5 ? 'Mükemmel' :
        rating >= 4.0 ? 'Çok İyi' :
        rating >= 3.5 ? 'İyi' : 'Orta',
      score:
        rating >= 4.5 ? '+10%' :
        rating >= 4.0 ? '+8%'  :
        rating >= 3.5 ? '+5%'  : '+2%',
      color:
        rating >= 4.5 ? '#28a745' :
        rating >= 4.0 ? '#20c997' :
        rating >= 3.5 ? '#ffc107' : '#6c757d',
    },
    {
      name: 'Şehir Uyumu',
      value: caseCity && lawyerCity
        ? (caseCity === lawyerCity ? 'Aynı Şehir' : 'Farklı Şehir')
        : 'Bilinmiyor',
      score: caseCity && lawyerCity && caseCity === lawyerCity ? '+3%' : '0%',
      color: caseCity && lawyerCity && caseCity === lawyerCity ? '#20c997' : '#6c757d',
    },
  ];

  const overallText =
    score >= 0.8 ? '🏆 Mükemmel Eşleşme'
  : score >= 0.6 ? '✅ İyi Eşleşme'
  : score >= 0.4 ? '⚠️ Orta Eşleşme'
                 : '❌ Düşük Eşleşme';

  const actionText =
    score >= 0.8 ? 'Hemen İletişime Geçin'
  : score >= 0.6 ? 'İletişime Geçmeyi Düşünün'
  : score >= 0.4 ? 'Alternatifleri Değerlendirin'
                 : 'Başka Seçenekleri İnceleyin';

  return (
    <div className="score-analysis">
      <div className="analysis-header">
        <h4>📊 Skor Analizi</h4>
        <p>Eşleştirme skorunun nasıl hesaplandığını görün</p>
      </div>

      <div className="analysis-grid">
        <div className="breakdown-section">
          <h5>Skor Dağılımı</h5>
          <div className="breakdown-items">
            <div className="breakdown-item">
              <span>Ana Skor:</span>
              <span className="breakdown-value">{(breakdown.baseScore * 100).toFixed(1)}%</span>
            </div>
            <div className="breakdown-item">
              <span>Deneyim Bonusu:</span>
              <span className="breakdown-value positive">+{(breakdown.experienceBonus * 100).toFixed(1)}%</span>
            </div>
            <div className="breakdown-item">
              <span>Puan Bonusu:</span>
              <span className="breakdown-value positive">+{(breakdown.ratingBonus * 100).toFixed(1)}%</span>
            </div>
            <div className="breakdown-item">
              <span>Şehir Uyumu:</span>
              <span className="breakdown-value positive">+{(breakdown.cityBonus * 100).toFixed(1)}%</span>
            </div>
            <div className="breakdown-item total">
              <span>Toplam Skor:</span>
              <span className="breakdown-value">{(score * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="factors-section">
          <h5>Eşleştirme Faktörleri</h5>
          <div className="factors-grid">
            {factors.map((f, i) => (
              <div key={i} className="factor-card">
                <div className="factor-header">
                  <span className="factor-name">{f.name}</span>
                  <span className="factor-score" style={{ color: f.color }}>{f.score}</span>
                </div>
                <div className="factor-value" style={{ color: f.color }}>{f.value}</div>
              </div>
            ))}
          </div>
          {languages.length > 0 && (
            <div className="muted" style={{ marginTop: 8 }}>
              <strong>Diller:</strong> {languages.join(', ')}
            </div>
          )}
        </div>
      </div>

      <div className="analysis-summary">
        <div className="summary-item">
          <span className="summary-label">Genel Değerlendirme:</span>
          <span className="summary-value">{overallText}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Önerilen İşlem:</span>
          <span className="summary-value">{actionText}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreAnalysis;
