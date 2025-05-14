// import Cookie from "cookie-universal";

// const cookie = Cookie();

// export const isAuthenticated = () => {
//     const token = cookie.get("auth-token");
//     return !!token;
// };

// export const getUserType = () => {
//     return cookie.get("user-type"); // "patient" or "doctor"
// };

// export const getUserData = () => {
//     const userData = cookie.get("user-data");
//     return userData ? JSON.parse(userData) : null;
// };

// auth.js

import Cookie from 'cookie-universal';

const cookie = Cookie();

export const isAuthenticated = () => {
    const token = cookie.get('auth-token');
    return !!token;
};

export const getUserType = () => {
    return cookie.get('user-type'); // 'patient' or 'doctor'
};

export const getUserData = () => {
    const userData = cookie.get('user-data');
    return userData ? JSON.parse(userData) : null;
};
