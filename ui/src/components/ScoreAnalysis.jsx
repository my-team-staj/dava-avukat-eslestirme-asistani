import React from 'react';
import '../App.css';

const ScoreAnalysis = ({ match, caseData }) => {
  const getScoreBreakdown = (match) => {
    // Gerçek uygulamada bu veriler backend'den gelir
    const baseScore = match.score;
    const experienceBonus = Math.min((match.experienceYears || 0) * 0.02, 0.1);
    const ratingBonus = Math.min((match.rating || 0) * 0.1, 0.1);
    const languageBonus = caseData?.language === match.language ? 0.05 : 0;
    const cityBonus = caseData?.city === match.city ? 0.03 : 0;
    const urgencyBonus = caseData?.urgencyLevel === 'Yüksek' ? 0.02 : 0;
    const proBonoBonus = caseData?.requiresProBono && match.availableForProBono ? 0.03 : 0;
    
    return {
      baseScore: baseScore - experienceBonus - ratingBonus - languageBonus - cityBonus - urgencyBonus - proBonoBonus,
      experienceBonus,
      ratingBonus,
      languageBonus,
      cityBonus,
      urgencyBonus,
      proBonoBonus,
      total: baseScore
    };
  };

  const getScoreFactors = (match, caseData) => {
    const factors = [];
    
    // Deneyim faktörü
    if (match.experienceYears >= 10) {
      factors.push({ name: 'Deneyim', value: 'Çok Yüksek', score: '+10%', color: '#28a745' });
    } else if (match.experienceYears >= 5) {
      factors.push({ name: 'Deneyim', value: 'Yüksek', score: '+7%', color: '#20c997' });
    } else if (match.experienceYears >= 2) {
      factors.push({ name: 'Deneyim', value: 'Orta', score: '+4%', color: '#ffc107' });
    } else {
      factors.push({ name: 'Deneyim', value: 'Düşük', score: '+1%', color: '#fd7e14' });
    }

    // Puan faktörü
    if (match.rating >= 4.5) {
      factors.push({ name: 'Müşteri Puanı', value: 'Mükemmel', score: '+10%', color: '#28a745' });
    } else if (match.rating >= 4.0) {
      factors.push({ name: 'Müşteri Puanı', value: 'Çok İyi', score: '+7%', color: '#20c997' });
    } else if (match.rating >= 3.5) {
      factors.push({ name: 'Müşteri Puanı', value: 'İyi', score: '+4%', color: '#ffc107' });
    } else {
      factors.push({ name: 'Müşteri Puanı', value: 'Orta', score: '+1%', color: '#fd7e14' });
    }

    // Dil uyumu
    if (caseData?.language === match.language) {
      factors.push({ name: 'Dil Uyumu', value: 'Mükemmel', score: '+5%', color: '#28a745' });
    } else {
      factors.push({ name: 'Dil Uyumu', value: 'Uyumsuz', score: '0%', color: '#6c757d' });
    }

    // Şehir uyumu
    if (caseData?.city === match.city) {
      factors.push({ name: 'Şehir Uyumu', value: 'Aynı Şehir', score: '+3%', color: '#20c997' });
    } else {
      factors.push({ name: 'Şehir Uyumu', value: 'Farklı Şehir', score: '0%', color: '#6c757d' });
    }

    // Aciliyet uyumu
    if (caseData?.urgencyLevel === 'Yüksek' && match.experienceYears >= 5) {
      factors.push({ name: 'Acil Durum', value: 'Uygun', score: '+2%', color: '#28a745' });
    } else if (caseData?.urgencyLevel === 'Yüksek') {
      factors.push({ name: 'Acil Durum', value: 'Dikkat', score: '0%', color: '#ffc107' });
    } else {
      factors.push({ name: 'Acil Durum', value: 'Normal', score: '0%', color: '#6c757d' });
    }

    // Pro Bono uyumu
    if (caseData?.requiresProBono && match.availableForProBono) {
      factors.push({ name: 'Pro Bono', value: 'Uygun', score: '+3%', color: '#28a745' });
    } else if (caseData?.requiresProBono) {
      factors.push({ name: 'Pro Bono', value: 'Uygun Değil', score: '0%', color: '#dc3545' });
    } else {
      factors.push({ name: 'Pro Bono', value: 'Gerekli Değil', score: '0%', color: '#6c757d' });
    }

    return factors;
  };

  const breakdown = getScoreBreakdown(match);
  const factors = getScoreFactors(match, caseData);

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
              <span>Dil Uyumu:</span>
              <span className="breakdown-value positive">+{(breakdown.languageBonus * 100).toFixed(1)}%</span>
            </div>
            <div className="breakdown-item">
              <span>Şehir Uyumu:</span>
              <span className="breakdown-value positive">+{(breakdown.cityBonus * 100).toFixed(1)}%</span>
            </div>
            <div className="breakdown-item">
              <span>Acil Durum:</span>
              <span className="breakdown-value positive">+{(breakdown.urgencyBonus * 100).toFixed(1)}%</span>
            </div>
            <div className="breakdown-item">
              <span>Pro Bono:</span>
              <span className="breakdown-value positive">+{(breakdown.proBonoBonus * 100).toFixed(1)}%</span>
            </div>
            <div className="breakdown-item total">
              <span>Toplam Skor:</span>
              <span className="breakdown-value">{(match.score * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="factors-section">
          <h5>Eşleştirme Faktörleri</h5>
          <div className="factors-grid">
            {factors.map((factor, index) => (
              <div key={index} className="factor-card">
                <div className="factor-header">
                  <span className="factor-name">{factor.name}</span>
                  <span className="factor-score" style={{ color: factor.color }}>
                    {factor.score}
                  </span>
                </div>
                <div className="factor-value" style={{ color: factor.color }}>
                  {factor.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analysis-summary">
        <div className="summary-item">
          <span className="summary-label">Genel Değerlendirme:</span>
          <span className="summary-value">
            {match.score >= 0.8 ? '🏆 Mükemmel Eşleşme' :
             match.score >= 0.6 ? '✅ İyi Eşleşme' :
             match.score >= 0.4 ? '⚠️ Orta Eşleşme' : '❌ Düşük Eşleşme'}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Önerilen İşlem:</span>
          <span className="summary-value">
            {match.score >= 0.8 ? 'Hemen İletişime Geçin' :
             match.score >= 0.6 ? 'İletişime Geçmeyi Düşünün' :
             match.score >= 0.4 ? 'Alternatifleri Değerlendirin' : 'Başka Seçenekleri İnceleyin'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreAnalysis;
