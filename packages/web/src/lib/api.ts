import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api',
    withCredentials: true,
});

// Add token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('API Request - Token:', token ? 'exists' : 'missing', 'URL:', config.url);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);