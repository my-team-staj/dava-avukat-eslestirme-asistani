// ui/src/components/CaseFormTabs.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CaseForm, CaseFormTab, CaseFormErrors, AsyncSelectDataSource } from '../types/case';
import AsyncSearchableSelect from './inputs/AsyncSearchableSelect.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../App.css';

const API_BASE = 'https://localhost:60227/api';

// Data sources for async selects
const DATA_SOURCES: Record<string, AsyncSelectDataSource> = {
  contacts: {
    endpoint: `${API_BASE}/contacts`,
    searchParam: 'search',
    labelField: 'fullName',
    valueField: 'id'
  },
  employees: {
    endpoint: `${API_BASE}/employees`,
    searchParam: 'search',
    labelField: 'fullName',
    valueField: 'id'
  },
  workingGroups: {
    endpoint: `${API_BASE}/workinggroups`,
    searchParam: 'search',
    labelField: 'groupName',
    valueField: 'id'
  },
  statuses: {
    endpoint: `${API_BASE}/statuses`,
    searchParam: 'search',
    labelField: 'statusName',
    valueField: 'id'
  },
  priorities: {
    endpoint: `${API_BASE}/priorities`,
    searchParam: 'search',
    labelField: 'priorityName',
    valueField: 'id'
  },
  fileTypes: {
    endpoint: `${API_BASE}/file-types`,
    searchParam: 'search',
    labelField: 'typeName',
    valueField: 'id'
  },
  tariffTypes: {
    endpoint: `${API_BASE}/tariff-types`,
    searchParam: 'search',
    labelField: 'tariffName',
    valueField: 'id'
  },
  courts: {
    endpoint: `${API_BASE}/courts`,
    searchParam: 'search',
    labelField: 'courtName',
    valueField: 'id'
  }
};

const TABS: { key: CaseFormTab; label: string }[] = [
  { key: 'genel', label: 'GENEL' },
  { key: 'ekip', label: 'EKİP' },
  { key: 'dosya-sinifi', label: 'DOSYA SINIFI VE SÜRECİ' },
  { key: 'fatura-ucret', label: 'FATURA, ÜCRET VE TARİFE' },
  { key: 'mahkeme-yargi', label: 'MAHKEME / YARGI BİLGİLERİ' },
  { key: 'izleme-meta', label: 'İZLEME / META' }
];

interface CaseFormTabsProps {
  mode: 'create' | 'edit';
  caseId?: number;
}

export default function CaseFormTabs({ mode, caseId }: CaseFormTabsProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<CaseFormTab>(
    (searchParams.get('tab') as CaseFormTab) || 'genel'
  );
  
  const [formData, setFormData] = useState<CaseForm>({
    // Required fields with defaults
    contactClient: '',
    fileSubject: '',
    caseResponsible: '',
    prmNatureOfAssignment: '',
    prmCasePlaceofUseSubject: '',
    subjectMatterDescription: '',
    isToBeInvoiced: false,
    city: '',
    description: '',
    
    // Optional fields start as null/undefined
    country: null,
    county: null,
    address: null,
    attorney1: null,
    attorney2: null,
    attorney3: null,
    
    // New nullable fields
    isActive: true, // Default to active for new cases
  });
  
  const [errors, setErrors] = useState<CaseFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load existing case data for edit mode
  useEffect(() => {
    if (mode === 'edit' && caseId) {
      loadCaseData(caseId);
    }
  }, [mode, caseId]);

  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const loadCaseData = async (id: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/cases/${id}`);
      const caseData = response.data;
      
      // Map API response to form data
      setFormData({
        // Required fields
        contactClient: caseData.contactClient || '',
        fileSubject: caseData.fileSubject || '',
        caseResponsible: caseData.caseResponsible || '',
        prmNatureOfAssignment: caseData.prmNatureOfAssignment || '',
        prmCasePlaceofUseSubject: caseData.prmCasePlaceofUseSubject || '',
        subjectMatterDescription: caseData.subjectMatterDescription || '',
        isToBeInvoiced: caseData.isToBeInvoiced || false,
        city: caseData.city || '',
        description: caseData.description || '',
        
        // Optional existing fields
        country: caseData.country || null,
        county: caseData.county || null,
        address: caseData.address || null,
        attorney1: caseData.attorney1 || null,
        attorney2: caseData.attorney2 || null,
        attorney3: caseData.attorney3 || null,
        
        // New nullable fields
        fileCaseViewId: caseData.fileCaseViewId || null,
        fileCaseId: caseData.fileCaseId || null,
        isOfficeFile: caseData.isOfficeFile || null,
        isPrivateFile: caseData.isPrivateFile || null,
        isProposalFile: caseData.isProposalFile || null,
        contactClientId: caseData.contactClientId || null,
        contactIntermadiaryCompanyId: caseData.contactIntermadiaryCompanyId || null,
        contactCounter: caseData.contactCounter || null,
        fileNo: caseData.fileNo || null,
        prmStatus: caseData.prmStatus || null,
        prmPriority: caseData.prmPriority || null,
        tariffType: caseData.tariffType || null,
        fileOpenDate: caseData.fileOpenDate || null,
        fileCloseDate: caseData.fileCloseDate || null,
        courtAuthorityReferenceNo: caseData.courtAuthorityReferenceNo || null,
        createDate: caseData.createDate || null,
        fileType: caseData.fileType || null,
        fileTypeValue: caseData.fileTypeValue || null,
        fileStatus: caseData.fileStatus || null,
        hardCopyLocation: caseData.hardCopyLocation || null,
        globalSystemCustomerId: caseData.globalSystemCustomerId || null,
        isActive: caseData.isActive !== undefined ? caseData.isActive : true,
        lastModifiedDate: caseData.lastModifiedDate || null,
        lastModifiedGlobalUser: caseData.lastModifiedGlobalUser || null,
        organizationEmployeeId: caseData.organizationEmployeeId || null,
        prmStatusTypeValue: caseData.prmStatusTypeValue || null,
        fileCaseReferenceNo: caseData.fileCaseReferenceNo || null,
        authorList: caseData.authorList || null,
        readerList: caseData.readerList || null,
        contactCounterId: caseData.contactCounterId || null,
        fileSubjectId: caseData.fileSubjectId || null,
        prmStatusId: caseData.prmStatusId || null,
        prmPriorityId: caseData.prmPriorityId || null,
        tariffTypeId: caseData.tariffTypeId || null,
        workingGroupId: caseData.workingGroupId || null,
        fileTypeId: caseData.fileTypeId || null,
        fileStatusId: caseData.fileStatusId || null,
        hardCopyLocationId: caseData.hardCopyLocationId || null,
        lastModifiedGlobalUserId: caseData.lastModifiedGlobalUserId || null,
        hardCopyLocationDesc: caseData.hardCopyLocationDesc || null,
        clientReferenceNo: caseData.clientReferenceNo || null,
        oaCasePartner: caseData.oaCasePartner || null,
        supervisor: caseData.supervisor || null,
        contactCourt: caseData.contactCourt || null,
        contactCourtHouseId: caseData.contactCourtHouseId || null,
        contactCourtLocation: caseData.contactCourtLocation || null,
        contactLocationCourtId: caseData.contactLocationCourtId || null,
        prmNatureOfAssignmentId: caseData.prmNatureOfAssignmentId || null,
        note: caseData.note || null,
        isDemoRecord: caseData.isDemoRecord || null,
        financeContactAccountId: caseData.financeContactAccountId || null,
        createBy: caseData.createBy || null,
        rowVersion: caseData.rowVersion || null,
      });
    } catch (error) {
      console.error('Error loading case data:', error);
      toast.error('Dava bilgileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: CaseFormErrors = {};
    
    // Required field validation
    if (!formData.contactClient?.trim()) {
      newErrors.contactClient = 'Müvekkil alanı zorunludur';
    }
    if (!formData.fileSubject?.trim()) {
      newErrors.fileSubject = 'Dosya konusu alanı zorunludur';
    }
    if (!formData.caseResponsible?.trim()) {
      newErrors.caseResponsible = 'Dava sorumlusu alanı zorunludur';
    }
    if (!formData.prmNatureOfAssignment?.trim()) {
      newErrors.prmNatureOfAssignment = 'Görevin niteliği alanı zorunludur';
    }
    if (!formData.prmCasePlaceofUseSubject?.trim()) {
      newErrors.prmCasePlaceofUseSubject = 'Kullanım yeri konusu alanı zorunludur';
    }
    if (!formData.subjectMatterDescription?.trim()) {
      newErrors.subjectMatterDescription = 'Konu açıklaması alanı zorunludur';
    }
    if (!formData.city?.trim()) {
      newErrors.city = 'Şehir alanı zorunludur';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Açıklama alanı zorunludur';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CaseForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Lütfen zorunlu alanları doldurun');
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        // Ensure required fields are not null
        contactClient: formData.contactClient || '',
        fileSubject: formData.fileSubject || '',
        caseResponsible: formData.caseResponsible || '',
        prmNatureOfAssignment: formData.prmNatureOfAssignment || '',
        prmCasePlaceofUseSubject: formData.prmCasePlaceofUseSubject || '',
        subjectMatterDescription: formData.subjectMatterDescription || '',
        city: formData.city || '',
        description: formData.description || '',
      };
      
      if (mode === 'create') {
        await axios.post(`${API_BASE}/cases`, payload);
        toast.success('✅ Dava başarıyla oluşturuldu!');
        navigate('/davalar');
      } else {
        await axios.put(`${API_BASE}/cases/${caseId}`, payload);
        toast.success('✅ Dava başarıyla güncellendi!');
        navigate('/davalar');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('❌ Kayıt sırasında bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/davalar');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Dava bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-header">
        <h2 className="form-title">
          {mode === 'create' ? 'Yeni Dava Oluştur' : 'Dava Düzenle'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="case-form">
        {/* Tabs Navigation */}
        <div className="form-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={`form-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="form-tab-content">
          {activeTab === 'genel' && (
            <GeneralTab 
              formData={formData} 
              errors={errors} 
              onChange={handleInputChange}
            />
          )}
          
          {activeTab === 'ekip' && (
            <TeamTab 
              formData={formData} 
              errors={errors} 
              onChange={handleInputChange}
            />
          )}
          
          {activeTab === 'dosya-sinifi' && (
            <FileClassificationTab 
              formData={formData} 
              errors={errors} 
              onChange={handleInputChange}
            />
          )}
          
          {activeTab === 'fatura-ucret' && (
            <BillingTab 
              formData={formData} 
              errors={errors} 
              onChange={handleInputChange}
            />
          )}
          
          {activeTab === 'mahkeme-yargi' && (
            <CourtTab 
              formData={formData} 
              errors={errors} 
              onChange={handleInputChange}
            />
          )}
          
          {activeTab === 'izleme-meta' && (
            <TrackingTab 
              formData={formData} 
              errors={errors} 
              onChange={handleInputChange}
              mode={mode}
            />
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="form-btn-secondary"
            onClick={handleCancel}
            disabled={submitting}
          >
            İptal
          </button>
          <button
            type="submit"
            className="form-btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Kaydediliyor...' : (mode === 'create' ? 'Oluştur' : 'Güncelle')}
          </button>
        </div>
      </form>
    </div>
  );
}

// Tab Components
interface TabProps {
  formData: CaseForm;
  errors: CaseFormErrors;
  onChange: (field: keyof CaseForm, value: any) => void;
  mode?: 'create' | 'edit';
}

function GeneralTab({ formData, errors, onChange }: TabProps) {
  return (
    <div className="form-section">
      <h3 className="form-section-title">Genel Bilgiler</h3>
      <div className="form-grid">
        <div className={`form-field required`}>
          <label htmlFor="contactClient">Müvekkil</label>
          <AsyncSearchableSelect
            dataSource={DATA_SOURCES.contacts}
            value={formData.contactClientId}
            onChange={(value, option) => {
              onChange('contactClientId', value);
              onChange('contactClient', option?.fullName || '');
            }}
            placeholder="Müvekkil seçin veya arayın..."
            required
            aria-label="Müvekkil seçin"
          />
          {errors.contactClient && <div className="form-error">{errors.contactClient}</div>}
        </div>

        <div className={`form-field required`}>
          <label htmlFor="fileSubject">Dosya Konusu</label>
          <input
            type="text"
            id="fileSubject"
            className="form-input"
            value={formData.fileSubject}
            onChange={(e) => onChange('fileSubject', e.target.value)}
            placeholder="Örn: Miras Davası"
            required
          />
          {errors.fileSubject && <div className="form-error">{errors.fileSubject}</div>}
        </div>

        <div className={`form-field required`}>
          <label htmlFor="caseResponsible">Dava Sorumlusu</label>
          <AsyncSearchableSelect
            dataSource={DATA_SOURCES.employees}
            value={formData.organizationEmployeeId}
            onChange={(value, option) => {
              onChange('organizationEmployeeId', value);
              onChange('caseResponsible', option?.fullName || '');
            }}
            placeholder="Sorumlu kişi seçin..."
            required
            aria-label="Dava sorumlusu seçin"
          />
          {errors.caseResponsible && <div className="form-error">{errors.caseResponsible}</div>}
        </div>

        <div className="form-field form-grid-full">
          <label htmlFor="subjectMatterDescription">Konu Açıklaması</label>
          <textarea
            id="subjectMatterDescription"
            className="form-input form-textarea"
            value={formData.subjectMatterDescription}
            onChange={(e) => onChange('subjectMatterDescription', e.target.value)}
            placeholder="Dava konusu hakkında detaylı açıklama..."
            rows={4}
            required
          />
          {errors.subjectMatterDescription && <div className="form-error">{errors.subjectMatterDescription}</div>}
        </div>

        <div className="form-field">
          <label>Faturalandırılacak mı?</label>
          <div className="form-switch">
            <input
              type="checkbox"
              id="isToBeInvoiced"
              checked={formData.isToBeInvoiced}
              onChange={(e) => onChange('isToBeInvoiced', e.target.checked)}
            />
            <span className="form-switch-label">Evet</span>
          </div>
        </div>

        <div className={`form-field required`}>
          <label htmlFor="city">Şehir</label>
          <input
            type="text"
            id="city"
            className="form-input"
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Örn: İstanbul"
            required
          />
          {errors.city && <div className="form-error">{errors.city}</div>}
        </div>

        <div className="form-field">
          <label htmlFor="county">İlçe</label>
          <input
            type="text"
            id="county"
            className="form-input"
            value={formData.county || ''}
            onChange={(e) => onChange('county', e.target.value || null)}
            placeholder="Örn: Kadıköy"
          />
        </div>

        <div className="form-field">
          <label htmlFor="country">Ülke</label>
          <input
            type="text"
            id="country"
            className="form-input"
            value={formData.country || ''}
            onChange={(e) => onChange('country', e.target.value || null)}
            placeholder="Örn: Türkiye"
          />
        </div>

        <div className="form-field form-grid-full">
          <label htmlFor="address">Adres</label>
          <textarea
            id="address"
            className="form-input form-textarea"
            value={formData.address || ''}
            onChange={(e) => onChange('address', e.target.value || null)}
            placeholder="Detaylı adres bilgisi..."
            rows={2}
          />
        </div>

        <div className="form-field form-grid-full">
          <label htmlFor="description">Açıklama</label>
          <textarea
            id="description"
            className="form-input form-textarea"
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Dava ile ilgili genel açıklama..."
            rows={4}
            required
          />
          {errors.description && <div className="form-error">{errors.description}</div>}
        </div>

        <div className="form-field">
          <label htmlFor="fileNo">Dosya No</label>
          <input
            type="text"
            id="fileNo"
            className="form-input"
            value={formData.fileNo || ''}
            onChange={(e) => onChange('fileNo', e.target.value || null)}
            placeholder="Örn: 2024/001"
          />
        </div>

        <div className="form-field">
          <label htmlFor="clientReferenceNo">Müvekkil Referans No</label>
          <input
            type="text"
            id="clientReferenceNo"
            className="form-input"
            value={formData.clientReferenceNo || ''}
            onChange={(e) => onChange('clientReferenceNo', e.target.value || null)}
            placeholder="Müvekkilin referans numarası"
          />
        </div>

        <div className="form-field">
          <label htmlFor="fileOpenDate">Dosya Açılış Tarihi</label>
          <div className="form-datepicker">
            <input
              type="date"
              id="fileOpenDate"
              className="form-input"
              value={formData.fileOpenDate || ''}
              onChange={(e) => onChange('fileOpenDate', e.target.value || null)}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="fileCloseDate">Dosya Kapanış Tarihi</label>
          <div className="form-datepicker">
            <input
              type="date"
              id="fileCloseDate"
              className="form-input"
              value={formData.fileCloseDate || ''}
              onChange={(e) => onChange('fileCloseDate', e.target.value || null)}
            />
          </div>
        </div>

        <div className="form-field">
          <label>Aktif</label>
          <div className="form-switch">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive || false}
              onChange={(e) => onChange('isActive', e.target.checked)}
            />
            <span className="form-switch-label">Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamTab({ formData, errors, onChange }: TabProps) {
  return (
    <div className="form-section">
      <h3 className="form-section-title">Ekip Bilgileri</h3>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="organizationEmployee">Organizasyon Çalışanı</label>
          <AsyncSearchableSelect
            dataSource={DATA_SOURCES.employees}
            value={formData.organizationEmployeeId}
            onChange={(value) => onChange('organizationEmployeeId', value)}
            placeholder="Çalışan seçin..."
            aria-label="Organizasyon çalışanı seçin"
          />
        </div>

        <div className="form-field">
          <label htmlFor="oaCasePartner">OA Dava Ortağı</label>
          <input
            type="text"
            id="oaCasePartner"
            className="form-input"
            value={formData.oaCasePartner || ''}
            onChange={(e) => onChange('oaCasePartner', e.target.value || null)}
            placeholder="Dava ortağı adı"
          />
        </div>

        <div className="form-field">
          <label htmlFor="supervisor">Süpervizör</label>
          <input
            type="text"
            id="supervisor"
            className="form-input"
            value={formData.supervisor || ''}
            onChange={(e) => onChange('supervisor', e.target.value || null)}
            placeholder="Süpervizör adı"
          />
        </div>


        <div className="form-field form-grid-full">
          <label htmlFor="authorList">Yazar Listesi</label>
          <textarea
            id="authorList"
            className="form-input form-textarea"
            value={formData.authorList || ''}
            onChange={(e) => onChange('authorList', e.target.value || null)}
            placeholder="Yazarları virgülle ayırın..."
            rows={3}
          />
        </div>

        <div className="form-field form-grid-full">
          <label htmlFor="readerList">Okuyucu Listesi</label>
          <textarea
            id="readerList"
            className="form-input form-textarea"
            value={formData.readerList || ''}
            onChange={(e) => onChange('readerList', e.target.value || null)}
            placeholder="Okuyucuları virgülle ayırın..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

function FileClassificationTab({ formData, errors, onChange }: TabProps) {
  return (
    <div className="form-section">
      <h3 className="form-section-title">Dosya Sınıfı ve Süreç Bilgileri</h3>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="fileCaseViewId">Dosya Dava Görünüm ID</label>
          <input
            type="number"
            id="fileCaseViewId"
            className="form-input"
            value={formData.fileCaseViewId || ''}
            onChange={(e) => onChange('fileCaseViewId', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="Görünüm ID"
          />
        </div>

        <div className="form-field">
          <label htmlFor="fileCaseId">Dosya Dava ID</label>
          <input
            type="number"
            id="fileCaseId"
            className="form-input"
            value={formData.fileCaseId || ''}
            onChange={(e) => onChange('fileCaseId', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="Dava ID"
          />
        </div>

        <div className="form-field">
          <label htmlFor="prmStatus">Durum</label>
          <AsyncSearchableSelect
            dataSource={DATA_SOURCES.statuses}
            value={formData.prmStatusId}
            onChange={(value, option) => {
              onChange('prmStatusId', value);
              onChange('prmStatus', option?.statusName || null);
            }}
            placeholder="Durum seçin..."
            aria-label="Durum seçin"
          />
        </div>

        <div className="form-field">
          <label htmlFor="prmPriority">Öncelik</label>
          <AsyncSearchableSelect
            dataSource={DATA_SOURCES.priorities}
            value={formData.prmPriorityId}
            onChange={(value, option) => {
              onChange('prmPriorityId', value);
              onChange('prmPriority', option?.priorityName || null);
            }}
            placeholder="Öncelik seçin..."
            aria-label="Öncelik seçin"
          />
        </div>

        <div className="form-field">
          <label htmlFor="workingGroup">Çalışma Grubu</label>
          <AsyncSearchableSelect
            dataSource={DATA_SOURCES.workingGroups}
            value={formData.workingGroupId}
            onChange={(value) => onChange('workingGroupId', value)}
            placeholder="Çalışma grubu seçin..."
            aria-label="Çalışma grubu seçin"
          />
        </div>

        <div className="form-field">
          <label htmlFor="fileType">Dosya Türü</label>
          <AsyncSearchableSelect
            dataSource={DATA_SOURCES.fileTypes}
            value={formData.fileTypeId}
            onChange={(value, option) => {
              onChange('fileTypeId', value);
              onChange('fileType', option?.typeName || null);
            }}
            placeholder="Dosya türü seçin..."
            aria-label="Dosya türü seçin"
          />
        </div>

        <div className="form-field">
          <label>Ofis Dosyası</label>
          <div className="form-switch">
            <input
              type="checkbox"
              id="isOfficeFile"
              checked={formData.isOfficeFile || false}
              onChange={(e) => onChange('isOfficeFile', e.target.checked)}
            />
            <span className="form-switch-label">Ofis Dosyası</span>
          </div>
        </div>

        <div className="form-field">
          <label>Özel Dosya</label>
          <div className="form-switch">
            <input
              type="checkbox"
              id="isPrivateFile"
              checked={formData.isPrivateFile || false}
              onChange={(e) => onChange('isPrivateFile', e.target.checked)}
            />
            <span className="form-switch-label">Özel Dosya</span>
          </div>
        </div>

        <div className="form-field">
          <label>Teklif Dosyası</label>
          <div className="form-switch">
            <input
              type="checkbox"
              id="isProposalFile"
              checked={formData.isProposalFile || false}
              onChange={(e) => onChange('isProposalFile', e.target.checked)}
            />
            <span className="form-switch-label">Teklif Dosyası</span>
          </div>
        </div>

        <div className={`form-field required`}>
          <label htmlFor="prmNatureOfAssignment">Görevin Niteliği</label>
          <input
            type="text"
            id="prmNatureOfAssignment"
            className="form-input"
            value={formData.prmNatureOfAssignment}
            onChange={(e) => onChange('prmNatureOfAssignment', e.target.value)}
            placeholder="Örn: Danışmanlık / Dava Takibi"
            required
          />
          {errors.prmNatureOfAssignment && <div className="form-error">{errors.prmNatureOfAssignment}</div>}
        </div>

        <div className={`form-field required`}>
          <label htmlFor="prmCasePlaceofUseSubject">Kullanım Yeri Konusu</label>
          <input
            type="text"
            id="prmCasePlaceofUseSubject"
            className="form-input"
            value={formData.prmCasePlaceofUseSubject}
            onChange={(e) => onChange('prmCasePlaceofUseSubject', e.target.value)}
            placeholder="Örn: Ankara Adliyesi / İcra Dairesi"
            required
          />
          {errors.prmCasePlaceofUseSubject && <div className="form-error">{errors.prmCasePlaceofUseSubject}</div>}
        </div>

        <div className="form-field">
          <label htmlFor="fileCaseReferenceNo">Dosya Dava Referans No</label>
          <input
            type="text"
            id="fileCaseReferenceNo"
            className="form-input"
            value={formData.fileCaseReferenceNo || ''}
            onChange={(e) => onChange('fileCaseReferenceNo', e.target.value || null)}
            placeholder="Referans numarası"
          />
        </div>

        <div className="form-field">
          <label htmlFor="courtAuthorityReferenceNo">Mahkeme Otorite Referans No</label>
          <input
            type="text"
            id="courtAuthorityReferenceNo"
            className="form-input"
            value={formData.courtAuthorityReferenceNo || ''}
            onChange={(e) => onChange('courtAuthorityReferenceNo', e.target.value || null)}
            placeholder="Mahkeme referans numarası"
          />
        </div>

        <div className="form-field">
          <label htmlFor="contactCounter">İletişim Sayacı</label>
          <input
            type="text"
            id="contactCounter"
            className="form-input"
            value={formData.contactCounter || ''}
            onChange={(e) => onChange('contactCounter', e.target.value || null)}
            placeholder="İletişim sayacı"
          />
        </div>
      </div>
    </div>
  );
}

function BillingTab({ formData, errors, onChange }: TabProps) {
  return (
    <div className="form-section">
      <h3 className="form-section-title">Fatura, Ücret ve Tarife Bilgileri</h3>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="tariffType">Tarife Türü</label>
          <AsyncSearchableSelect
            dataSource={DATA_SOURCES.tariffTypes}
            value={formData.tariffTypeId}
            onChange={(value, option) => {
              onChange('tariffTypeId', value);
              onChange('tariffType', option?.tariffName || null);
            }}
            placeholder="Tarife türü seçin..."
            aria-label="Tarife türü seçin"
          />
        </div>

        <div className="form-field">
          <label htmlFor="financeContactAccount">Finans İletişim Hesabı</label>
          <AsyncSearchableSelect
            dataSource={DATA_SOURCES.contacts}
            value={formData.financeContactAccountId}
            onChange={(value) => onChange('financeContactAccountId', value)}
            placeholder="Finans hesabı seçin..."
            aria-label="Finans hesabı seçin"
          />
        </div>

        <div className="form-field">
          <label htmlFor="hardCopyLocation">Fiziki Kopya Konumu</label>
          <input
            type="text"
            id="hardCopyLocation"
            className="form-input"
            value={formData.hardCopyLocation || ''}
            onChange={(e) => onChange('hardCopyLocation', e.target.value || null)}
            placeholder="Fiziki dosya konumu"
          />
        </div>

        <div className="form-field form-grid-full">
          <label htmlFor="hardCopyLocationDesc">Fiziki Kopya Konum Açıklaması</label>
          <textarea
            id="hardCopyLocationDesc"
            className="form-input form-textarea"
            value={formData.hardCopyLocationDesc || ''}
            onChange={(e) => onChange('hardCopyLocationDesc', e.target.value || null)}
            placeholder="Fiziki dosya konumu detaylı açıklama..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

function CourtTab({ formData, errors, onChange }: TabProps) {
  return (
    <div className="form-section">
      <h3 className="form-section-title">Mahkeme ve Yargı Bilgileri</h3>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="contactCourt">Mahkeme</label>
          <input
            type="text"
            id="contactCourt"
            className="form-input"
            value={formData.contactCourt || ''}
            onChange={(e) => onChange('contactCourt', e.target.value || null)}
            placeholder="Mahkeme adı"
          />
        </div>

        <div className="form-field">
          <label htmlFor="contactCourtHouse">Mahkeme Binası</label>
          <AsyncSearchableSelect
            dataSource={DATA_SOURCES.courts}
            value={formData.contactCourtHouseId}
            onChange={(value) => onChange('contactCourtHouseId', value)}
            placeholder="Mahkeme binası seçin..."
            aria-label="Mahkeme binası seçin"
          />
        </div>

        <div className="form-field">
          <label htmlFor="contactCourtLocation">Mahkeme Konumu</label>
          <input
            type="text"
            id="contactCourtLocation"
            className="form-input"
            value={formData.contactCourtLocation || ''}
            onChange={(e) => onChange('contactCourtLocation', e.target.value || null)}
            placeholder="Mahkeme konumu"
          />
        </div>

        <div className="form-field">
          <label htmlFor="contactLocationCourt">Konum Mahkemesi</label>
          <AsyncSearchableSelect
            dataSource={DATA_SOURCES.courts}
            value={formData.contactLocationCourtId}
            onChange={(value) => onChange('contactLocationCourtId', value)}
            placeholder="Konum mahkemesi seçin..."
            aria-label="Konum mahkemesi seçin"
          />
        </div>
      </div>
    </div>
  );
}

function TrackingTab({ formData, errors, onChange, mode }: TabProps) {
  return (
    <div className="form-section">
      <h3 className="form-section-title">İzleme ve Meta Bilgiler</h3>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="createDate">Oluşturma Tarihi</label>
          <input
            type="datetime-local"
            id="createDate"
            className="form-input"
            value={formData.createDate || ''}
            onChange={(e) => onChange('createDate', e.target.value || null)}
            disabled={mode === 'edit'}
          />
        </div>

        <div className="form-field">
          <label htmlFor="createBy">Oluşturan</label>
          <input
            type="text"
            id="createBy"
            className="form-input"
            value={formData.createBy || ''}
            onChange={(e) => onChange('createBy', e.target.value || null)}
            placeholder="Oluşturan kişi"
            disabled={mode === 'edit'}
          />
        </div>

        <div className="form-field">
          <label htmlFor="lastModifiedDate">Son Değişiklik Tarihi</label>
          <input
            type="datetime-local"
            id="lastModifiedDate"
            className="form-input"
            value={formData.lastModifiedDate || ''}
            disabled
          />
        </div>

        <div className="form-field">
          <label htmlFor="lastModifiedGlobalUser">Son Değiştiren</label>
          <input
            type="text"
            id="lastModifiedGlobalUser"
            className="form-input"
            value={formData.lastModifiedGlobalUser || ''}
            disabled
          />
        </div>

        <div className="form-field">
          <label>Demo Kayıt</label>
          <div className="form-switch">
            <input
              type="checkbox"
              id="isDemoRecord"
              checked={formData.isDemoRecord || false}
              onChange={(e) => onChange('isDemoRecord', e.target.checked)}
            />
            <span className="form-switch-label">Demo Kayıt</span>
          </div>
        </div>

        <div className="form-field form-grid-full">
          <label htmlFor="note">Not</label>
          <textarea
            id="note"
            className="form-input form-textarea"
            value={formData.note || ''}
            onChange={(e) => onChange('note', e.target.value || null)}
            placeholder="Ek notlar..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
