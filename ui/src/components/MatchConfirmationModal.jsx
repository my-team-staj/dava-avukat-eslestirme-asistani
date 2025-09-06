import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import apiClient, { API_CONFIG, postChooseSafe } from '../config/api';
import '../App.css';

const MatchConfirmationModal = ({ 
  isOpen, 
  onClose, 
  caseData, 
  lawyerData, 
  onSuccess 
}) => {
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isProcessing) {
        setIsProcessing(false); // State'i sıfırla
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Modal açıldığında ilk butona focus
      setTimeout(() => {
        if (confirmButtonRef.current) {
          confirmButtonRef.current.focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isProcessing, onClose]);

  // Modal kapandığında state'i sıfırla
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Arka plan tıklaması ile kapatma
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isProcessing) {
      setIsProcessing(false); // State'i sıfırla
      onClose();
    }
  };

  // Enter tuşu ile onaylama
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleConfirm();
    }
  };

  const handleConfirm = async () => {
    if (!caseData || !lawyerData || isProcessing) return;

    setIsProcessing(true);
    
    try {
      const payload = {
        caseId: caseData.id,
        lawyerId: lawyerData.lawyerId,
        score: Number((lawyerData.score || 0).toFixed(2)),
      };

      await postChooseSafe(payload);
      
      toast.success(`✅ Eşleştirme başarıyla kaydedildi: ${lawyerData.name} (${payload.score})`);
      
      // Başarılı işlem sonrası callback çağır
      if (onSuccess) {
        onSuccess(payload);
      }
      
      // Modal'ı kapat ve state'i temizle
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 500); // Kısa bir gecikme ile modal'ı kapat
      
    } catch (error) {
      console.error('Eşleştirme hatası:', error);
      toast.error('❌ Eşleştirme kaydedilemedi. Lütfen tekrar deneyin.');
      
      // Hata durumunda butonları tekrar etkinleştir
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (!isProcessing) {
      setIsProcessing(false); // State'i sıfırla
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div 
        className="modal-card confirm-card" 
        ref={modalRef}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="modal-title">Eşleştirmeyi Onayla</h2>
          <button 
            className="modal-close" 
            onClick={handleCancel}
            disabled={isProcessing}
            aria-label="Modal'ı kapat"
          >
            ×
          </button>
        </div>

        <div className="modal-body" id="modal-description">
          <div className="confirmation-content">
            <div className="confirmation-summary">
              <div className="summary-item">
                <strong>Dava:</strong> 
                <span className="case-info">
                  {caseData?.title}
                </span>
              </div>
              
              <div className="summary-item">
                <strong>Avukat:</strong> 
                <span className="lawyer-info">
                  {lawyerData?.name}
                </span>
              </div>
              
              <div className="summary-item">
                <strong>Eşleştirme Skoru:</strong> 
                <span className="score-info" style={{ color: getScoreColor(lawyerData?.score || 0), fontWeight: '700' }}>
                  {(lawyerData?.score || 0).toFixed(2)} ({getScoreText(lawyerData?.score || 0)})
                </span>
              </div>
            </div>

            <div className="confirmation-description">
              <p>
                Bu işlem seçili avukatı ilgili davayla eşleştirir. 
                Eşleştirme kaydedildikten sonra bu avukat dava için atanmış olacaktır.
              </p>
            </div>

            {isProcessing && (
              <div className="processing-indicator">
                <div className="spinner-small"></div>
                <span>Eşleştirme kaydediliyor...</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button
            ref={cancelButtonRef}
            className="btn-secondary"
            onClick={handleCancel}
            disabled={isProcessing}
            type="button"
          >
            Vazgeç
          </button>
          <button
            ref={confirmButtonRef}
            className="primary-btn"
            onClick={handleConfirm}
            disabled={isProcessing}
            type="button"
          >
            {isProcessing ? 'Kaydediliyor...' : 'Onayla'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Yardımcı fonksiyonlar (MatchPage'den kopyalandı)
const getScoreColor = (score) => {
  if (score >= 0.8) return 'var(--success)';
  if (score >= 0.6) return 'var(--warning)';
  return 'var(--error)';
};

const getScoreText = (score) => {
  if (score >= 0.9) return 'Süper';
  if (score >= 0.8) return 'Mükemmel';
  if (score >= 0.7) return 'Çok İyi';
  if (score >= 0.6) return 'İyi';
  if (score >= 0.5) return 'Orta';
  return 'Düşük';
};

export default MatchConfirmationModal;
