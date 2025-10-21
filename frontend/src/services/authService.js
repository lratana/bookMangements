import api from './api.js';

class AuthService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    // Login user
    async login(credentials) {
        try {
            const response = await api.post('/users/login', credentials);
            const { user, token } = response.data;

            // Store token and user info
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            this.token = token;
            this.user = user;

            // Set token for future API calls
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Register new user
    async register(userData) {
        try {
            const response = await api.post('/users/register', userData);
            const { user, token } = response.data;

            // Store token and user info
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            this.token = token;
            this.user = user;

            // Set token for future API calls
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        this.token = null;
        this.user = null;

        // Remove token from API headers
        delete api.defaults.headers.common['Authorization'];
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Get token
    getToken() {
        return this.token;
    }

    // Check if user has specific role
    hasRole(role) {
        return this.user && this.user.role === role;
    }

    // Initialize auth state on app startup
    initialize() {
        if (this.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        }
    }
}

// Create singleton instance
const authService = new AuthService();

export default authService;