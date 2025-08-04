import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

const register = (userData) => apiClient.post("/auth/register", userData);
const login = (credentials) => apiClient.post("/auth/login", credentials);

const getApiKeys = () => apiClient.get("/api/apikeys");
const createApiKey = (keyData) => apiClient.post("/api/apikeys", keyData);
const deleteApiKey = (id) => apiClient.delete(`/api/apikeys/${id}`);

const getDataForApiKey = (id, params) =>
  apiClient.get(`/api/data/${id}`, { params });

const apiService = {
  setAuthToken,
  register,
  login,
  getApiKeys,
  createApiKey,
  deleteApiKey,
  getDataForApiKey,
};

export default apiService;
