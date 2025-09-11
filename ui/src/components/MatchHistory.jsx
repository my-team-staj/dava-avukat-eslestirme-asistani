// ui/src/components/MatchHistory.jsx
import React, { useEffect, useState } from 'react';
import apiClient, { API_CONFIG, getChoicesByCaseSafe } from '../config/api';

const MatchHistory = ({ caseId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        if (caseId) {
          // En güvenlisi: by-case endpoint (fallbacklı helper)
          const list = await getChoicesByCaseSafe(caseId);
          const normalized = (Array.isArray(list) ? list : []).map((x, i) => ({
            id: x?.id ?? `${caseId}-${i}`,
            caseId: x?.caseId ?? caseId,
            caseTitle: x?.caseFileSubject ?? x?.case?.fileSubject ?? '-',
            lawyerId: x?.lawyerId ?? x?.lawyer?.id,
            lawyerName: x?.lawyerFullName ?? x?.lawyer?.fullName ?? x?.lawyer?.name ?? `#${x?.lawyerId ?? '?'}`,
            matchedAt: x?.matchedAt ?? x?.createdAt ?? new Date().toISOString(),
            score: typeof x?.score === 'number' ? x.score : 0
          }));
          if (mounted) setItems(normalized);
        } else {
          // Genel liste: GET /api/match/choices (opsiyonel)
          const res = await apiClient.get(API_CONFIG.ENDPOINTS.MATCH_CHOICES);
          const arr = Array.isArray(res?.data) ? res.data : (res?.data?.items || []);
          const normalized = arr.map((x, i) => ({
            id: x?.id ?? `${i}`,
            caseId: x?.caseId,
            caseTitle: x?.caseFileSubject ?? x?.case?.fileSubject ?? '-',
            lawyerId: x?.lawyerId ?? x?.lawyer?.id,
            lawyerName: x?.lawyerFullName ?? x?.lawyer?.fullName ?? x?.lawyer?.name ?? `#${x?.lawyerId ?? '?'}`,
            matchedAt: x?.matchedAt ?? x?.createdAt ?? new Date().toISOString(),
            score: typeof x?.score === 'number' ? x.score : 0
          }));
          if (mounted) setItems(normalized);
        }
      } catch (e) {
        console.error('Match history fetch error:', e);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [caseId]);

  if (loading) return <div className="form-card">Yükleniyor…</div>;

  return (
    <div className="match-history">
      <h2>Eşleştirme Geçmişi {caseId ? `(Case #${caseId})` : ''}</h2>
      {items.length === 0 ? (
        <div className="form-card">Kayıt bulunamadı.</div>
      ) : (
        <ul className="history-list">
          {items.map(item => (
            <li key={item.id} className="history-item">
              <p><strong>Dava:</strong> {item.caseTitle}</p>
              <p><strong>Avukat:</strong> {item.lawyerName}</p>
              <p><strong>Tarih:</strong> {new Date(item.matchedAt).toLocaleString()}</p>
              <p><strong>Skor:</strong> {item.score.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MatchHistory;
