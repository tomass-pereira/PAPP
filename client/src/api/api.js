import { BASE_URL } from './config';

import axios from 'axios';

const api = axios.create({
  baseURL: BASE_URL // ou a URL do seu backend
});

// Adiciona o token em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export default api;