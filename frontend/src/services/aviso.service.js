import axios from "axios";
import cookies from "js-cookie";

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
    const token = cookies.get('jwt-auth', { path: '/' });
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => Promise.reject(error)
);

const getAllAdvices = () => {
    return instance.get('/avisos');
};

const getAllActivities = () => {
    return instance.get('/actividades');
};

export default {
    getAllAdvices,
    getAllActivities
};