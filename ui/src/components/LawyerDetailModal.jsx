import React, { useState, useEffect } from 'react';
import { FaTimes, FaUserTie, FaMapMarkerAlt, FaStar, FaBriefcase, FaLanguage, FaHandshake } from 'react-icons/fa';
import apiClient, { API_CONFIG } from '../config/api';
import "../App.css";

// güvenli dizi
function toArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}

// --- çalışma grupları global cache (modal için) ---
let _wgMap = null;
let _wgPromise = null;

const WG_URLS = [
  (API_CONFIG?.ENDPOINTS?.WORKING_GROUPS) || '/working-groups',
  '/workinggroups',
  '/workinggroup',
  '/groups',
];

function extractArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}
function buildWgMap(arr) {
  const map = {};
  for (const g of arr) {
    const id = g?.id ?? g?.groupId ?? g?.wgId;
    const name = g?.name ?? g?.title ?? g?.groupName ?? g?.displayName;
    if (id != null && name) map[String(id)] = String(name);
  }
  return map;
}

async function getWorkingGroupMap() {
  if (_wgMap) return _wgMap;
  if (_wgPromise) return _wgPromise;

  _wgPromise = (async () => {
    for (const url of WG_URLS) {
      try {
        const res = await apiClient.get(url);
        const arr = extractArray(res?.data);
        if (arr.length) {
          _wgMap = buildWgMap(arr);
          return _wgMap;
        }
      } catch (_) {}
    }
    _wgMap = {};
    return _wgMap;
  })();

  return _wgPromise;
}

const LawyerDetailModal = ({ lawyerId, isOpen, onClose }) => {
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wgMap, setWgMap] = useState({});

  useEffect(() => {
    if (isOpen && lawyerId) {
      fetchLawyerDetails();
      getWorkingGroupMap().then(setWgMap);
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

  const languages = toArray(lawyer?.languages ?? lawyer?.languagesSpoken ?? []);

  const inlineGroupName =
    lawyer?.workingGroup?.name ||
    lawyer?.workingGroupName ||
    lawyer?.workingGroupTitle ||
    null;

  const idForMap = lawyer?.workingGroupId ?? lawyer?.workingGroupID ?? lawyer?.groupId;
  const mapName = idForMap != null ? wgMap[String(idForMap)] : null;

  const workingGroupName = inlineGroupName || mapName || "-";

  return (
    <div className="modal-overlay lawyer-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Avukat Detayları</h2>
          <button className="close-button" onClick={onClose}>
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
                <h3>{lawyer.name}</h3>
                <div className="lawyer-rating">
                  <FaStar className="star-icon" />
                  <span>{(lawyer.rating ?? 0)}/5.0</span>
                </div>
              </div>
            </div>

            <div className="lawyer-stats">
              <div className="stat-item">
                <FaBriefcase className="stat-icon" />
                <div>
                  <span className="stat-value">{lawyer.experienceYears ?? 0}</span>
                  <span className="stat-label">Yıl Deneyim</span>
                </div>
              </div>
              <div className="stat-item">
                <FaHandshake className="stat-icon" />
                <div>
                  <span className="stat-value">{lawyer.totalCasesHandled ?? 0}</span>
                  <span className="stat-label">Toplam Dava</span>
                </div>
              </div>
            </div>

            <div className="lawyer-details-grid">
              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <span><strong>Şehir:</strong> {lawyer.city || '-'}</span>
              </div>

              <div className="detail-item">
                <FaLanguage className="detail-icon" />
                <span><strong>Diller:</strong> {languages.length ? languages.join(', ') : '-'}</span>
              </div>

              <div className="detail-item">
                <FaHandshake className="detail-icon" />
                <span><strong>Pro Bono:</strong> {lawyer.availableForProBono ? 'Evet' : 'Hayır'}</span>
              </div>

              {/* 🔹 kesinlikle AD */}
              <div className="detail-item">
                <FaUserTie className="detail-icon" />
                <span><strong>Çalışma Grubu:</strong> {workingGroupName}</span>
              </div>
            </div>

            {lawyer.description && (
              <div className="lawyer-description">
                <h4>Açıklama</h4>
                <p>{lawyer.description}</p>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-secondary" onClick={onClose}>Kapat</button>
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
