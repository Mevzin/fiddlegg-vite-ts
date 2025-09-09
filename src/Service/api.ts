import axios, { AxiosError, AxiosResponse } from 'axios';

let loadingContext: { showLoading: () => void; hideLoading: () => void } | null = null;

export const setLoadingContext = (context: { showLoading: () => void; hideLoading: () => void }) => {
    loadingContext = context;
};

export const apiBase = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiBase.interceptors.request.use(
    (config) => {
        if (loadingContext) {
            loadingContext.showLoading();
        }
        return config;
    },
    (error) => {
        if (loadingContext) {
            loadingContext.hideLoading();
        }
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

apiBase.interceptors.response.use(
    (response: AxiosResponse) => {
        if (loadingContext) {
            loadingContext.hideLoading();
        }
        return response;
    },
    (error: AxiosError) => {
        if (loadingContext) {
            loadingContext.hideLoading();
        }
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
