// export const baseURL = `http://127.0.0.1:8000/auth`;

// export const API_ROUTES = {
//     REGISTER: "signup/",
//     LOGIN: {
//         ADMIN: "login/admin/",
//         DOCTOR: "login/doctor/",
//         PATIENT: "login/patient/"
//     },
//     JWT: {
//         CREATE: "jwt/create/",
//         REFRESH: "jwt/refresh/",
//         VERIFY: "jwt/verify/"
//     }
// };

export const baseURL = `http://127.0.0.1:8000/auth`;

export const API_ENDPOINTS = {
    PATIENT: {
        LOGIN: "login/patient/",
        REGISTER: "signup/"
    },
    DOCTOR: {
        LOGIN: "login/doctor/",
        REGISTER: "signup/"
    }
};