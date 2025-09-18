// ... (senin mevcut import ve CONFIG'lerin aynen kalsın)
import axios from "axios";

export const API_CONFIG = {
  BASE_URL: "https://localhost:60227/api",
  ENDPOINTS: {
    CASES: "/cases",
    LAWYERS: "/lawyers",
    WORKING_GROUPS: "/workinggroups",
    MATCH: "/match/suggest",
    MATCH_CHOOSE: "/match/choose",
    MATCH_CHOICES: "/match/choices",
    MATCH_DELETE_BY_CASE: "/match/choices/by-case",
    
    // New endpoints for enhanced case form
    CONTACTS: "/contacts",
    EMPLOYEES: "/employees",
    STATUSES: "/statuses",
    PRIORITIES: "/priorities",
    FILE_TYPES: "/file-types",
    TARIFF_TYPES: "/tariff-types",
    COURTS: "/courts",
  },
  TIMEOUT: 30000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("❌ API", error.response.status, error.response.data);
    } else {
      console.error("❌ API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// ------- Fallback yardımcıları -------
const tryAlternatives = async (fnList) => {
  let lastErr;
  for (const fn of fnList) {
    try { return await fn(); } catch (e) { lastErr = e; }
  }
  throw lastErr;
};

const withProtocolGet = (relativeUrl) => [
  () => apiClient.get(relativeUrl),
  () =>
    axios.get(API_CONFIG.BASE_URL.replace("https://", "http://") + relativeUrl, {
      timeout: API_CONFIG.TIMEOUT,
    }),
];

const withProtocolPost = (relativeUrl, payload) => [
  () => apiClient.post(relativeUrl, payload),
  () =>
    axios.post(API_CONFIG.BASE_URL.replace("https://", "http://") + relativeUrl, payload, {
      headers: API_CONFIG.HEADERS,
      timeout: API_CONFIG.TIMEOUT,
    }),
];

const withProtocolPut = (relativeUrl, payload) => [
  () => apiClient.put(relativeUrl, payload),
  () =>
    axios.put(API_CONFIG.BASE_URL.replace("https://", "http://") + relativeUrl, payload, {
      headers: API_CONFIG.HEADERS,
      timeout: API_CONFIG.TIMEOUT,
    }),
];

// ------------------------------
//   UTIL: Query string builder
// ------------------------------
const qs = (params = {}) => {
  const esc = encodeURIComponent;
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${esc(k)}=${esc(v)}`);
  return parts.length ? `?${parts.join("&")}` : "";
};

// ------------------------------
//   SCORE Normalizer (UI için)
// ------------------------------
export const pickScore01 = (obj) => {
  const candidates = [
    obj?.score,
    obj?.totalScore,
    obj?.matchScore,
    obj?.scoreValue,
    obj?.confidence,
    obj?.probability,
  ];
  let raw = candidates.find((v) => v !== undefined && v !== null);
  if (raw === undefined || raw === null) return 0;
  if (typeof raw === "string") raw = parseFloat(raw.replace(",", "."));
  if (Number.isNaN(raw)) return 0;
  if (raw > 1 && raw <= 100) return Math.max(0, Math.min(1, raw / 100));
  if (raw >= 0 && raw <= 1) return raw;
  return Math.max(0, Math.min(1, raw));
};

// ======================================================
// ================  WORKING GROUPS  ====================
// ======================================================
export const listWorkingGroups = async () => {
  const res = await apiClient.get(API_CONFIG.ENDPOINTS.WORKING_GROUPS);
  return Array.isArray(res?.data) ? res.data : [];
};

// ======================================================
// ====================  LAWYERS  =======================
// ======================================================

// Listeleme (yeni query parametreleri ile)
export const getLawyers = async ({
  page = 1,
  pageSize = 10,
  sortBy = "FullName",
  sortOrder = "asc",
  city,
  isActive,
  searchTerm,
  title,
  languages,
} = {}) => {
  const url =
    API_CONFIG.ENDPOINTS.LAWYERS +
    qs({ page, pageSize, sortBy, sortOrder, city, isActive, searchTerm, title, languages });
  const res = await apiClient.get(url);
  return res?.data; // { page, pageSize, totalItems, totalPages, items: LawyerDto[] }
};

// Detay
export const getLawyerById = async (id) => {
  const res = await apiClient.get(`${API_CONFIG.ENDPOINTS.LAWYERS}/${id}`);
  return res?.data; // LawyerDto
};

// Create (DTO: LawyerCreateDto)
export const createLawyer = async (payload) => {
  // UI'da field adları farklıysa burada normalize ediyoruz:
  const body = {
    fullName: payload.fullName?.trim() ?? "",
    isActive: payload.isActive ?? true,
    city: payload.city ?? "",
    title: payload.title ?? "",
    phone: payload.phone ?? "",
    email: payload.email ?? "",
    startDate: payload.startDate ?? null, // ISO string veya null
    languages: payload.languages ?? "",
    education: payload.education ?? "",
    prmEmployeeRecordType: payload.prmEmployeeRecordType ?? "",
    workGroupId: payload.workGroupId ?? null, // DTO tarafında WorkGroupId
  };

  const res = await tryAlternatives(
    withProtocolPost(API_CONFIG.ENDPOINTS.LAWYERS, body)
  );
  return res?.data; // LawyerDto
};

// Update (DTO: LawyerUpdateDto)
export const updateLawyer = async (id, payload) => {
  const body = {
    fullName: payload.fullName?.trim() ?? "",
    isActive: payload.isActive ?? true,
    city: payload.city ?? "",
    title: payload.title ?? "",
    phone: payload.phone ?? "",
    email: payload.email ?? "",
    startDate: payload.startDate ?? null,
    languages: payload.languages ?? "",
    education: payload.education ?? "",
    prmEmployeeRecordType: payload.prmEmployeeRecordType ?? "",
    workGroupId: payload.workGroupId ?? null,
  };

  const res = await tryAlternatives(
    withProtocolPut(`${API_CONFIG.ENDPOINTS.LAWYERS}/${id}`, body)
  );
  return res?.data; // LawyerDto
};

// Delete (soft delete endpoint'i controller'da DELETE)
export const deleteLawyer = (id) =>
  apiClient.delete(`${API_CONFIG.ENDPOINTS.LAWYERS}/${id}`);

// ======================================================
// =====================  CASES  ========================
// ======================================================
export const deleteCase = (id) =>
  apiClient.delete(`${API_CONFIG.ENDPOINTS.CASES}/${id}`);

// ======================================================
// =====================  MATCH  ========================
// ======================================================

// Eski tüm varyantları güvenle yakalayan getChoicesByCaseSafe
export const getChoicesByCaseSafe = async (caseId) => {
  const patterns = [
    `${API_CONFIG.ENDPOINTS.MATCH_DELETE_BY_CASE}/${caseId}`,
    `/Match/choices/by-case/${caseId}`,
    `${API_CONFIG.ENDPOINTS.MATCH_CHOICES}?caseId=${caseId}`,
    `/Match/choices?caseId=${caseId}`,
    `${API_CONFIG.ENDPOINTS.MATCH_CHOICES}`,
    `/Match/choices`,
  ];
  for (let i = 0; i < patterns.length; i++) {
    try {
      const res = await tryAlternatives(withProtocolGet(patterns[i]));
      const data = res?.data;
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data?.items)) list = data.items;
      else if (Array.isArray(data?.data)) list = data.data;
      else if (data && typeof data === "object") list = [data];
      if (i >= 4) list = list.filter((x) => (x?.caseId ?? x?.caseID) === caseId);
      return list;
    } catch {}
  }
  return [];
};

// Match Suggest (LLM'e istek)
export const postSuggest = async ({ caseId, topK = 3 }) => {
  const payload = { caseId, topK };
  const res = await tryAlternatives(
    withProtocolPost(API_CONFIG.ENDPOINTS.MATCH, payload)
  );
  return res?.data;
};

// Match Choose (seçimi kaydet)
export const postChooseSafe = async (payload) => {
  const paths = [API_CONFIG.ENDPOINTS.MATCH_CHOOSE, "/Match/choose"];
  return await tryAlternatives(paths.flatMap((p) => withProtocolPost(p, payload)));
};

export default apiClient;
