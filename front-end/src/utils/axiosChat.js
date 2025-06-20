import axios from 'axios';
import Cookie from 'cookie-universal';

const cookie = Cookie();

const axiosChat = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

axiosChat.interceptors.request.use(
    (config) => {
        const token = cookie.get("auth-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Chat Request:', {
            url: config.url,
            method: config.method,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('Chat Request Error:', error);
        return Promise.reject(error);
    }
);

axiosChat.interceptors.response.use(
    (response) => {
        console.log('Chat Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Chat Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });

        if (error.response?.status === 401) {
            cookie.remove("auth-token");
            cookie.remove("user-type");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosChat; 