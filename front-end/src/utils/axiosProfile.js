import axios from 'axios';
import Cookie from 'cookie-universal';

const cookie = Cookie();

const axiosProfile = axios.create({
    baseURL: 'http://127.0.0.1:8000', 
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor
axiosProfile.interceptors.request.use(
    (config) => {
        const token = cookie.get("auth-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Log the request for debugging
        console.log('Request Config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
axiosProfile.interceptors.response.use(
    (response) => {
        // Log successful responses for debugging
        console.log('Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    async (error) => {
        // Log error details for debugging
        console.error('Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            cookie.remove("auth-token");
            cookie.remove("user-type");
            cookie.remove("user-data");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosProfile;