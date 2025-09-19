import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../App.css";

const API_BASE = "https://localhost:60227/api";

interface CaseData {
  id: number;
  contactClient: string;
  fileSubject: string;
  caseResponsible: string;
  subjectMatterDescription: string;
  city: string;
  county?: string;
  country?: string;
  isToBeInvoiced: boolean;
  address?: string;
  description: string;
  fileNo?: string;
  clientReferenceNo?: string;
  fileOpenDate?: string;
  fileCloseDate?: string;
  isActive?: boolean;
  // Diğer alanlar...
}

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseId = id ? parseInt(id, 10) : undefined;
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('genel');

  useEffect(() => {
    if (caseId) {
      fetchCaseData();
    }
  }, [caseId]);

  const fetchCaseData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/cases/${caseId}`);
      setCaseData(response.data);
    } catch (err) {
      console.error('Error fetching case:', err);
      setError('Dava bilgileri yüklenirken hata oluştu');
      toast.error('Dava bilgileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!caseId) {
    return <div className="container">Dava bulunamadı.</div>;
  }

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Dava bilgileri yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          <div>Hata: {error || 'Dava bulunamadı'}</div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-header">
        <h2 className="form-title">
          Dava Detayları
          <span className="read-only-badge">Salt Okunur</span>
        </h2>
      </div>

      <div className="case-detail-form">
        {/* Tabs Navigation */}
        <div className="form-tabs">
          <button 
            className={`form-tab ${activeTab === 'genel' ? 'active' : ''}`}
            onClick={() => setActiveTab('genel')}
          >
            GENEL
          </button>
          <button 
            className={`form-tab ${activeTab === 'ekip' ? 'active' : ''}`}
            onClick={() => setActiveTab('ekip')}
          >
            EKİP
          </button>
          <button 
            className={`form-tab ${activeTab === 'dosya-sinifi' ? 'active' : ''}`}
            onClick={() => setActiveTab('dosya-sinifi')}
          >
            DOSYA SINIFI VE SÜRECİ
          </button>
          <button 
            className={`form-tab ${activeTab === 'fatura-ucret' ? 'active' : ''}`}
            onClick={() => setActiveTab('fatura-ucret')}
          >
            FATURA, ÜCRET VE TARİFE
          </button>
          <button 
            className={`form-tab ${activeTab === 'mahkeme-yargi' ? 'active' : ''}`}
            onClick={() => setActiveTab('mahkeme-yargi')}
          >
            MAHKEME / YARGI BİLGİLERİ
          </button>
          <button 
            className={`form-tab ${activeTab === 'izleme-meta' ? 'active' : ''}`}
            onClick={() => setActiveTab('izleme-meta')}
          >
            İZLEME / META
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'genel' && (
          <div className="form-section">
            <h3 className="form-section-title">Genel Bilgiler</h3>
            <div className="form-grid">
              <div className="form-field required">
                <label>Müvekkil</label>
                <div className="read-only-field">{caseData.contactClient || '-'}</div>
              </div>

              <div className="form-field required">
                <label>Dosya Konusu</label>
                <div className="read-only-field">{caseData.fileSubject || '-'}</div>
              </div>

              <div className="form-field required">
                <label>Dava Sorumlusu</label>
                <div className="read-only-field">{caseData.caseResponsible || '-'}</div>
              </div>

              <div className="form-field form-grid-full">
                <label>Konu Açıklaması</label>
                <div className="read-only-field read-only-textarea">
                  {caseData.subjectMatterDescription || '-'}
                </div>
              </div>

              <div className="form-field required">
                <label>Şehir</label>
                <div className="read-only-field">{caseData.city || '-'}</div>
              </div>

              <div className="form-field">
                <label>İlçe</label>
                <div className="read-only-field">{caseData.county || '-'}</div>
              </div>

              <div className="form-field">
                <label>Ülke</label>
                <div className="read-only-field">{caseData.country || '-'}</div>
              </div>

              <div className="form-field">
                <label>Faturalandırılacak mı?</label>
                <div className="read-only-field">
                  <span className={`read-only-badge ${caseData.isToBeInvoiced ? 'yes' : 'no'}`}>
                    {caseData.isToBeInvoiced ? 'Evet' : 'Hayır'}
                  </span>
                </div>
              </div>

              <div className="form-field form-grid-full">
                <label>Adres</label>
                <div className="read-only-field read-only-textarea">
                  {caseData.address || '-'}
                </div>
              </div>

              <div className="form-field form-grid-full">
                <label>Açıklama</label>
                <div className="read-only-field read-only-textarea">
                  {caseData.description || '-'}
                </div>
              </div>

              <div className="form-field">
                <label>Dosya No</label>
                <div className="read-only-field">{caseData.fileNo || '-'}</div>
              </div>

              <div className="form-field">
                <label>Müvekkil Referans No</label>
                <div className="read-only-field">{caseData.clientReferenceNo || '-'}</div>
              </div>

              <div className="form-field">
                <label>Dosya Açılış Tarihi</label>
                <div className="read-only-field">
                  {caseData.fileOpenDate ? new Date(caseData.fileOpenDate).toLocaleDateString('tr-TR') : '-'}
                </div>
              </div>

              <div className="form-field">
                <label>Dosya Kapanış Tarihi</label>
                <div className="read-only-field">
                  {caseData.fileCloseDate ? new Date(caseData.fileCloseDate).toLocaleDateString('tr-TR') : '-'}
                </div>
              </div>

              <div className="form-field">
                <label>Aktif</label>
                <div className="read-only-field">
                  <span className={`read-only-badge ${caseData.isActive ? 'yes' : 'no'}`}>
                    {caseData.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ekip' && (
          <div className="form-section">
            <h3 className="form-section-title">Ekip Bilgileri</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Çalışma Grubu</label>
                <div className="read-only-field">-</div>
              </div>
              <div className="form-field">
                <label>Organizasyon Çalışanı</label>
                <div className="read-only-field">-</div>
              </div>
              <div className="form-field">
                <label>Yazar Listesi</label>
                <div className="read-only-field">-</div>
              </div>
              <div className="form-field">
                <label>Okuyucu Listesi</label>
                <div className="read-only-field">-</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dosya-sinifi' && (
          <div className="form-section">
            <h3 className="form-section-title">Dosya Sınıfı ve Süreci</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Dosya Sınıfı</label>
                <div className="read-only-field">-</div>
              </div>
              <div className="form-field">
                <label>Dosya Durumu</label>
                <div className="read-only-field">-</div>
              </div>
              <div className="form-field">
                <label>Öncelik</label>
                <div className="read-only-field">-</div>
              </div>
              <div className="form-field">
                <label>Dosya Tipi</label>
                <div className="read-only-field">-</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fatura-ucret' && (
          <div className="form-section">
            <h3 className="form-section-title">Fatura, Ücret ve Tarife</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Fatura Kontak Hesabı</label>
                <div className="read-only-field">-</div>
              </div>
              <div className="form-field">
                <label>Ücret Bilgileri</label>
                <div className="read-only-field">-</div>
              </div>
              <div className="form-field">
                <label>Tarife Bilgileri</label>
                <div className="read-only-field">-</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mahkeme-yargi' && (
          <div className="form-section">
            <h3 className="form-section-title">Mahkeme / Yargı Bilgileri</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Mahkeme Binası</label>
                <div className="read-only-field">-</div>
              </div>
              <div className="form-field">
                <label>Konum Mahkemesi</label>
                <div className="read-only-field">-</div>
              </div>
              <div className="form-field">
                <label>Mahkeme Bilgileri</label>
                <div className="read-only-field">-</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'izleme-meta' && (
          <div className="form-section">
            <h3 className="form-section-title">İzleme / Meta</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Oluşturulma Tarihi</label>
                <div className="read-only-field">-</div>
              </div>
              <div className="form-field">
                <label>Güncellenme Tarihi</label>
                <div className="read-only-field">-</div>
              </div>
              <div className="form-field">
                <label>Meta Bilgileri</label>
                <div className="read-only-field">-</div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="form-btn-secondary"
            onClick={() => navigate('/davalar')}
          >
            Listeye Dön
          </button>
        </div>
      </div>
    </div>
  );
}
