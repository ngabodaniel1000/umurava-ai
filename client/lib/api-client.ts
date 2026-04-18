import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    withCredentials: true, // Crucial for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to handle unauthorized errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user'); // Also clearing user since token is gone
                if (window.location.pathname !== '/login' && window.location.pathname !== '/' && window.location.pathname !== '/signup') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
