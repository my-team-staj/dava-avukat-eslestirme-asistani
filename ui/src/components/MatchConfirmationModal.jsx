// ui/src/components/MatchConfirmationModal.jsx
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { postChooseSafe } from '../config/api';
import '../App.css';

const MatchConfirmationModal = ({
  isOpen,
  onClose,
  caseData,        // { id, fileSubject, city, caseResponsible, contactClient, isToBeInvoiced, description, subjectMatterDescription, address }
  lawyerData,      // { lawyerId, name, city, workingGroup, score }
  onSuccess
}) => {
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isProcessing) {
        setIsProcessing(false);
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      setTimeout(() => { confirmButtonRef.current?.focus(); }, 100);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isProcessing, onClose]);

  useEffect(() => { if (!isOpen) setIsProcessing(false); }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isProcessing) {
      setIsProcessing(false);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isProcessing) handleConfirm();
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
      toast.success(`Eşleştirme kaydedildi: ${lawyerData.name} (${payload.score})`);
      onSuccess?.(payload);
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Eşleştirme hatası:', error);
      toast.error('Eşleştirme kaydedilemedi. Lütfen tekrar deneyin.');
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (!isProcessing) {
      setIsProcessing(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  const fileSubject = caseData?.fileSubject ?? '';
  const city = caseData?.city ?? '';
  const caseResponsible = caseData?.caseResponsible ?? '';
  const contactClient = caseData?.contactClient ?? '';
  const isToBeInvoiced = caseData?.isToBeInvoiced ? 'Evet' : 'Hayır';
  const description = caseData?.description ?? '';
  const subjectMatterDescription = caseData?.subjectMatterDescription ?? '';
  const address = caseData?.address ?? '';

  const lawyerName = lawyerData?.name ?? '-';
  const lawyerCity = lawyerData?.city ?? '-';
  const lawyerWG = lawyerData?.workingGroup ?? '-';
  const score = Number(lawyerData?.score || 0);

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
                <strong>Dosya Konusu:</strong>
                <span className="case-info">{fileSubject || '-'}</span>
              </div>

              <div className="summary-item">
                <strong>Şehir:</strong>
                <span className="case-info">{city || '-'}</span>
              </div>

              <div className="summary-item">
                <strong>Sorumlu:</strong>
                <span className="case-info">{caseResponsible || '-'}</span>
              </div>

              <div className="summary-item">
                <strong>Müvekkil:</strong>
                <span className="case-info">{contactClient || '-'}</span>
              </div>

              <div className="summary-item">
                <strong>Faturalandırılacak mı?</strong>
                <span className="case-info">{isToBeInvoiced}</span>
              </div>

              {(subjectMatterDescription || description || address) && (
                <div className="summary-item" style={{ display: 'block' }}>
                  {subjectMatterDescription && (
                    <div style={{ marginTop: 6 }}>
                      <strong>Konu Açıklaması:</strong>{' '}
                      <span className="case-info">
                        {subjectMatterDescription.length > 160
                          ? subjectMatterDescription.slice(0, 160) + '…'
                          : subjectMatterDescription}
                      </span>
                    </div>
                  )}
                  {description && (
                    <div style={{ marginTop: 6 }}>
                      <strong>Açıklama:</strong>{' '}
                      <span className="case-info">
                        {description.length > 160 ? description.slice(0, 160) + '…' : description}
                      </span>
                    </div>
                  )}
                  {address && (
                    <div style={{ marginTop: 6 }}>
                      <strong>Adres:</strong>{' '}
                      <span className="case-info">{address}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="summary-item">
                <strong>Avukat:</strong>
                <span className="lawyer-info">{lawyerName}</span>
              </div>

              <div className="summary-item">
                <strong>Avukat Şehir:</strong>
                <span className="lawyer-info">{lawyerCity}</span>
              </div>

              <div className="summary-item">
                <strong>Çalışma Grubu:</strong>
                <span className="lawyer-info">{lawyerWG}</span>
              </div>

              <div className="summary-item">
                <strong>Eşleştirme Skoru:</strong>
                <span
                  className="score-info"
                  style={{ color: getScoreColor(score), fontWeight: 700 }}
                >
                  {score.toFixed(2)} ({getScoreText(score)})
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

// Yardımcılar
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
