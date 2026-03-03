import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach Clerk token to every request if available
api.interceptors.request.use(async (config) => {
    try {
        // Clerk token is injected from outside via setAuthToken
        const token = window.__clerk_token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (_) { }
    return config;
});

export default api;
