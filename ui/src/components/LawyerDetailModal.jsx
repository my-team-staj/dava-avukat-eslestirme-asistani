import React, { useState, useEffect } from 'react';
import { FaTimes, FaUserTie, FaMapMarkerAlt, FaBriefcase, FaLanguage, FaIdBadge, FaCalendarAlt, FaAt, FaPhone } from 'react-icons/fa';
import apiClient, { API_CONFIG } from '../config/api';
import "../App.css";

function toArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}
const fmtDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString();
};
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

const LawyerDetailModal = ({ lawyerId, isOpen, onClose }) => {
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && lawyerId) {
      fetchLawyerDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, lawyerId]);

  const fetchLawyerDetails = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.LAWYERS}/${lawyerId}`);
      setLawyer(response.data);
    } catch (error) {
      console.error('Error fetching lawyer details:', error);
      setLawyer(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const languages = toArray(lawyer?.languages);
  const expYears = yearsFrom(lawyer?.startDate);

  return (
    <div className="modal-overlay lawyer-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header modal-header--teal">
          <h2 className="modal-title--white">Avukat Detayları</h2>
          <button className="close-button close-button--white" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Avukat bilgileri yükleniyor...</p>
          </div>
        ) : lawyer ? (
          <div className="lawyer-details">
            <div className="lawyer-header">
              <div className="lawyer-avatar"><FaUserTie /></div>
              <div className="lawyer-info">
                <h3 className="lawyer-name-strong">{lawyer.fullName}</h3>
                <div className="lawyer-rating" style={{ gap: 8 }}>
                  <span className={`pill-badge ${lawyer.isActive ? 'pill-teal' : 'pill-muted'}`}>
                    {lawyer.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                  {lawyer.title && <span className="pill-badge pill-outline">{lawyer.title}</span>}
                </div>
              </div>
            </div>

            <div className="lawyer-stats">
              <div className="stat-item stat-card">
                <FaBriefcase className="stat-icon stat-icon--teal" />
                <div>
                  <span className="stat-value">{expYears}</span>
                  <span className="stat-label">Yıl Deneyim</span>
                </div>
              </div>
              <div className="stat-item stat-card">
                <FaCalendarAlt className="stat-icon stat-icon--teal" />
                <div>
                  <span className="stat-value">{fmtDate(lawyer.startDate)}</span>
                  <span className="stat-label">Başlangıç</span>
                </div>
              </div>
            </div>

            <div className="lawyer-details-grid">
              <div className="detail-item detail-card">
                <FaMapMarkerAlt className="detail-icon detail-icon--teal" />
                <span><strong>Şehir:</strong> {lawyer.city || '-'}</span>
              </div>

              <div className="detail-item detail-card">
                <FaAt className="detail-icon detail-icon--teal" />
                <span><strong>E-posta:</strong> {lawyer.email || '-'}</span>
              </div>

              <div className="detail-item detail-card">
                <FaPhone className="detail-icon detail-icon--teal" />
                <span><strong>Telefon:</strong> {lawyer.phone || '-'}</span>
              </div>

              <div className="detail-item detail-card">
                <FaLanguage className="detail-icon detail-icon--teal" />
                <span><strong>Diller:</strong> {languages.length ? languages.join(', ') : '-'}</span>
              </div>

              <div className="detail-item detail-card">
                <FaIdBadge className="detail-icon detail-icon--teal" />
                <span><strong>Kayıt Tipi:</strong> {lawyer.prmEmployeeRecordType || '-'}</span>
              </div>
            </div>

            {lawyer.education && (
              <div className="lawyer-description">
                <h4>Eğitim</h4>
                <p>{lawyer.education}</p>
              </div>
            )}

            <div className="modal-actions">
              <button className="action-secondary-btn" onClick={onClose}>Kapat</button>
            </div>
          </div>
        ) : (
          <div className="error-message"><p>Avukat bilgileri yüklenemedi.</p></div>
        )}
      </div>
    </div>
  );
};

export default LawyerDetailModal;
