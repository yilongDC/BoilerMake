import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false
});

// Add request interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Remove CORS headers from request
    delete config.headers['Access-Control-Allow-Origin'];
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
        const response = await api.get('/auth/user/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export default api;
