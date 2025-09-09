import axios, { AxiosError, AxiosResponse } from 'axios';

export const apiBase = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiBase.interceptors.request.use(
    (config) => {
        if (import.meta.env.DEV) {
            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

apiBase.interceptors.response.use(
    (response: AxiosResponse) => {
        if (import.meta.env.DEV) {
            console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error: AxiosError) => {
        console.error('❌ API Error:', {
            status: error.response?.status,
            message: error.response?.data || error.message,
            url: error.config?.url
        });

        if (error.response?.status === 429) {
            console.warn('⚠️ Rate limit atingido. Aguarde antes de fazer nova requisição.');
        }

        if (error.code === 'ECONNABORTED') {
            console.error('⏱️ Timeout da requisição');
        }

        return Promise.reject(error);
    }
);
