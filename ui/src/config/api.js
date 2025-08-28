// API Konfigürasyonu
export const API_CONFIG = {
  // Backend API Base URL
  BASE_URL: 'https://localhost:60227/api',
  
  // Endpoints
  ENDPOINTS: {
    CASES: '/cases',
    LAWYERS: '/lawyers',
    WORKING_GROUPS: '/workinggroups',
    MATCH: '/match/suggest'
  },
  
  // Timeout ayarları
  TIMEOUT: 30000,
  
  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Axios instance oluşturma
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error);
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Response Status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
