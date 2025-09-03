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
  () => axios.get(API_CONFIG.BASE_URL.replace("https://","http://") + relativeUrl, {
    timeout: API_CONFIG.TIMEOUT
  }),
];

const withProtocolPost = (relativeUrl, payload) => [
  () => apiClient.post(relativeUrl, payload),
  () => axios.post(API_CONFIG.BASE_URL.replace("https://","http://") + relativeUrl, payload, {
    headers: API_CONFIG.HEADERS, timeout: API_CONFIG.TIMEOUT
  }),
];

// ------- Skor normalize edici util (UI da kullanacak) -------
export const pickScore01 = (obj) => {
  // olası alan adları
  const candidates = [
    obj?.score,
    obj?.totalScore,
    obj?.matchScore,
    obj?.scoreValue,
    obj?.confidence,
    obj?.probability,
  ];

  let raw = candidates.find(v => v !== undefined && v !== null);
  if (raw === undefined || raw === null) return 0;

  if (typeof raw === "string") raw = parseFloat(raw.replace(",", "."));
  if (Number.isNaN(raw)) return 0;

  // 0–100 aralığı geldiyse 0–1'e çevir
  if (raw > 1 && raw <= 100) return Math.max(0, Math.min(1, raw / 100));
  // 0–1 aralığında bekleriz
  if (raw >= 0 && raw <= 1) return raw;

  // beklenmedik — güvenli sınırla
  return Math.max(0, Math.min(1, raw));
};

// ------- Backend tarihçe: tüm varyantlar -------
export const getChoicesByCaseSafe = async (caseId) => {
  // 1) /match/choices/by-case/{caseId}
  // 2) /Match/choices/by-case/{caseId}
  // 3) /match/choices?caseId={caseId}
  // 4) /Match/choices?caseId={caseId}
  // 5) /match/choices  -> client-side filter
  // 6) /Match/choices  -> client-side filter
  const patterns = [
    `${API_CONFIG.ENDPOINTS.MATCH_DELETE_BY_CASE}/${caseId}`,
    `/Match/choices/by-case/${caseId}`,
    `${API_CONFIG.ENDPOINTS.MATCH_CHOICES}?caseId=${caseId}`,
    `/Match/choices?caseId=${caseId}`,
    `${API_CONFIG.ENDPOINTS.MATCH_CHOICES}`,
    `/Match/choices`,
  ];

  // sırayla dene
  for (let i = 0; i < patterns.length; i++) {
    try {
      const res = await tryAlternatives(withProtocolGet(patterns[i]));
      const data = res?.data;

      // olası veri şekilleri: dizi | {items:[...]} | {data:[...]} | tek kayıt
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data?.items)) list = data.items;
      else if (Array.isArray(data?.data)) list = data.data;
      else if (data && typeof data === "object") list = [data];

      // son iki varyant (tüm kayıtlar) için case filtresi
      if (i >= 4) list = list.filter(x => (x?.caseId ?? x?.caseID) === caseId);

      return list;
    } catch (e) {
      // diğer varyanta geç
    }
  }
  return []; // hepsi patlarsa boş
};

// ------- Choose fallback -------
export const postChooseSafe = async (payload) => {
  const paths = [
    API_CONFIG.ENDPOINTS.MATCH_CHOOSE,
    "/Match/choose",
  ];
  return await tryAlternatives(paths.flatMap(p => withProtocolPost(p, payload)));
};

export default apiClient;
