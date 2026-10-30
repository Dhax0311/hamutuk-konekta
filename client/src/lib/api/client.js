import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hamutuk_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If connection refused or offline, augment error for clean offline-first handling
    if (!error.response) {
      error.isNetworkError = true;
      error.friendlyMessage = 'Servidor sentrál la bele kontaktu agora (Offline / Network Error).';
    }
    return Promise.reject(error);
  }
);

// API Service Methods
export const api = {
  // Health
  checkHealth: () => apiClient.get('/health'),

  // Auth & Users
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getMe: () => apiClient.get('/auth/me'),
  getUsers: () => apiClient.get('/users'),
  createUser: (userData) => apiClient.post('/users', userData),

  // Reports
  getReports: (params) => apiClient.get('/reports', { params }),
  getReportById: (id) => apiClient.get(`/reports/${id}`),
  createReport: (reportData) => apiClient.post('/reports', reportData),
  syncReportsBatch: (reportsList) => apiClient.post('/reports/sync', { reports: reportsList }),
  verifyReport: (id) => apiClient.patch(`/reports/${id}/verify`),
  updateFollowUp: (id, data) => apiClient.patch(`/reports/${id}/follow-up`, data),

  // Community Needs
  getNeeds: () => apiClient.get('/needs'),
  createNeed: (needData) => apiClient.post('/needs', needData),
  updateNeedStatus: (id, status) => apiClient.patch(`/needs/${id}/status`, { status }),

  // Warnings
  getWarnings: () => apiClient.get('/warnings'),
  createWarning: (warningData) => apiClient.post('/warnings', warningData),

  // SiteWatch
  getSites: () => apiClient.get('/sitewatch/sites'),
  getSiteHistory: (id) => apiClient.get(`/sitewatch/sites/${id}/history`),
  sendHeartbeat: (id, data) => apiClient.post(`/sitewatch/sites/${id}/heartbeat`, data)
};

export default api;
