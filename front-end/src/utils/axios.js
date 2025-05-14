import axios from 'axios';
import Cookie from 'cookie-universal';

const cookie = Cookie();

// create axios instance with basic settings
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/auth',
    headers: {
        'Content-Type': 'application/json',
    }
});

// add interceptor for requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = cookie.get("auth-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// add interceptor for responses
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            cookie.remove("auth-token");
            cookie.remove("user-type");
            cookie.remove("user-data");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;