import axios from 'axios';

const API_URL = 'http://localhost:5000';

const authService = {
    async login(email, password) {
        try {
            console.debug('Attempting login with:', { email });
            const response = await axios.post(`${API_URL}/auth/login`, { email, password }, {
                withCredentials: true
            });
            console.debug('Login successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            throw error.response?.data || { error: 'An error occurred during login' };
        }
    },

    async signup(userData) {
        try {
            console.debug('Attempting signup with:', { 
                email: userData.email,
                username: userData.username 
            });
            // Transform fullName to name to match backend expectations
            const requestData = {
                ...userData,
                name: userData.fullName
            };
            delete requestData.fullName;
            delete requestData.confirmPassword;

            const response = await axios.post(`${API_URL}/auth/signup`, requestData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.debug('Signup successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('Signup failed:', error.response?.data || error.message);
            throw error.response?.data || { error: 'An error occurred during signup' };
        }
    },

    async logout() {
        try {
            console.debug('Attempting logout');
            const response = await fetch('/auth/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to logout');
            }

            return await response.json();
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    },

    async checkAuthStatus() {
        try {
            console.debug('Checking auth status');
            const response = await axios.get(`${API_URL}/auth/status`, {
                withCredentials: true
            });
            console.debug('Auth status check successful:', response.data);
            return response.data;
        } catch (error) {
            console.debug('Auth status check failed:', error.response?.data || error.message);
            return { authenticated: false };
        }
    }
};

export default authService;
