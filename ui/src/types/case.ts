// ui/src/types/case.ts
export interface CaseForm {
  // === REQUIRED FIELDS (existing) ===
  contactClient: string;
  fileSubject: string;
  caseResponsible: string;
  prmNatureOfAssignment: string;
  prmCasePlaceofUseSubject: string;
  subjectMatterDescription: string;
  isToBeInvoiced: boolean;
  city: string;
  description: string;

  // === OPTIONAL FIELDS (existing) ===
  country?: string | null;
  county?: string | null;
  address?: string | null;
  attorney1?: string | null;
  attorney2?: string | null;
  attorney3?: string | null;

  // === SOFT DELETE (hidden in form) ===
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;

  // === NEW NULLABLE FIELDS ===
  fileCaseViewId?: number | null;
  fileCaseId?: number | null;
  isOfficeFile?: boolean | null;
  isPrivateFile?: boolean | null;
  isProposalFile?: boolean | null;
  contactClientId?: number | null;
  contactIntermadiaryCompanyId?: number | null;
  contactCounter?: string | null;
  fileNo?: string | null;
  prmStatus?: string | null;
  prmPriority?: string | null;
  tariffType?: string | null;
  fileOpenDate?: string | null;
  fileCloseDate?: string | null;
  courtAuthorityReferenceNo?: string | null;
  createDate?: string | null;
  fileType?: string | null;
  fileTypeValue?: string | null;
  fileStatus?: string | null;
  hardCopyLocation?: string | null;
  globalSystemCustomerId?: number | null;
  isActive?: boolean | null;
  lastModifiedDate?: string | null;
  lastModifiedGlobalUser?: string | null;
  organizationEmployeeId?: number | null;
  prmStatusTypeValue?: string | null;
  fileCaseReferenceNo?: string | null;
  authorList?: string | null;
  readerList?: string | null;
  contactCounterId?: number | null;
  fileSubjectId?: number | null;
  prmStatusId?: number | null;
  prmPriorityId?: number | null;
  tariffTypeId?: number | null;
  workingGroupId?: number | null;
  fileTypeId?: number | null;
  fileStatusId?: number | null;
  hardCopyLocationId?: number | null;
  lastModifiedGlobalUserId?: number | null;
  hardCopyLocationDesc?: string | null;
  clientReferenceNo?: string | null;
  oaCasePartner?: string | null;
  supervisor?: string | null;
  contactCourt?: string | null;
  contactCourtHouseId?: number | null;
  contactCourtLocation?: string | null;
  contactLocationCourtId?: number | null;
  prmNatureOfAssignmentId?: number | null;
  note?: string | null;
  isDemoRecord?: boolean | null;
  financeContactAccountId?: number | null;
  createBy?: string | null;
  rowVersion?: string | null; // base64 if needed
}

// Helper type for select options with both ID and label
export interface SelectOption {
  id: number | null;
  label: string | null;
}

// Tab names for the form
export type CaseFormTab = 
  | 'genel' 
  | 'ekip' 
  | 'dosya-sinifi' 
  | 'fatura-ucret' 
  | 'mahkeme-yargi' 
  | 'izleme-meta';

// Form validation schema shape
export interface CaseFormErrors {
  [key: string]: string | undefined;
}

// API response types
export interface CaseApiResponse extends CaseForm {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Async select data sources
export interface AsyncSelectDataSource {
  endpoint: string;
  searchParam?: string;
  labelField: string;
  valueField: string;
}
