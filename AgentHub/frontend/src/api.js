import axios from 'axios';

const API = axios.create({ baseURL:import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export const getAgents = (params) => API.get('/agents', { params });
export const getFeatured = () => API.get('/agents/featured');
export const getTrending = () => API.get('/agents/trending');

export const getAiRecommendations = (query) => API.post('/ai/recommend', { query });

export const getAgent = (id) => API.get(`/agents/${id}`);
export const createAgent = (data) => API.post('/agents', data);
export const useAgent = (id, inputs) => API.post(`/agents/${id}/use`, { inputs });
export const addReview = (id, data) => API.post(`/agents/${id}/review`, data);
