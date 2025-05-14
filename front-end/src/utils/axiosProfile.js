import axios from 'axios';
import Cookie from 'cookie-universal';

const cookie = Cookie();

const axiosProfile = axios.create({
    baseURL: 'http://127.0.0.1:8000', 
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosProfile.interceptors.request.use(
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

axiosProfile.interceptors.response.use(
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

export default axiosProfile;
