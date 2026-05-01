import axios from 'axios';

// Ambil API URL dari environment variable atau gunakan default port backend 3030
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api';

console.log('API URL yang digunakan:', API_URL);

// Buat instance axios dengan konfigurasi dasar
const instance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true, // Penting untuk mengirim cookies dengan setiap request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tambahkan interceptor untuk debugging
instance.interceptors.request.use(
  (config) => {
    console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`, config);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`Response error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
