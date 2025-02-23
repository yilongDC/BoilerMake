import axios from 'axios';
import { getToken } from '../utils/auth';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor to add token
api.interceptors.request.use((config) => {
    const token = getToken();
    console.log('API Request Debug:', {
        endpoint: config.url,
        hasToken: !!token,
        tokenPrefix: token?.substring(0, 20)
    });
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getLeaderboard = async () => {
    try {
        const response = await api.get('/auth/leaderboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
};

export const checkIn = async (locationId) => {
    try {
        const response = await api.post('/auth/checkin', { locationId });
        return response.data;
    } catch (error) {
        console.error('Error checking in:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        console.log('Getting current user...');
        const response = await api.get('/auth/user/me');
        console.log('User data response:', response.data);
        return response.data;
    } catch (error) {
        console.error('getCurrentUser error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};

export default api;
