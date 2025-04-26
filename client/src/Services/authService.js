import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    register: async (userData) => {
        try {
            // Create FormData if there's a profile image
            if (userData.profileImage) {
                const formData = new FormData();
                Object.keys(userData).forEach(key => {
                    if (key === 'profileImage') {
                        formData.append('profileImage', userData.profileImage);
                    } else {
                        formData.append(key, userData[key]);
                    }
                });
                
                const response = await axios.post(`${API_URL}/auth/register`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                return response.data;
            } else {
                // Regular JSON request if no image
                const response = await axios.post(`${API_URL}/auth/register`, userData);
                return response.data;
            }
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            } else {
                throw new Error('Registration failed. Please try again.');
            }
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    updateProfile: async (userId, userData) => {
        try {
            const response = await axios.put(`${API_URL}/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    deleteProfile: async (userId) => {
        try {
            await axios.delete(`${API_URL}/users/${userId}`);
            localStorage.removeItem('user');
        } catch (error) {
            throw error.response.data;
        }
    },

    followUser: async (userId, followUserId) => {
        try {
            await axios.post(`${API_URL}/users/${userId}/follow/${followUserId}`);
        } catch (error) {
            throw error.response.data;
        }
    },

    unfollowUser: async (userId, unfollowUserId) => {
        try {
            await axios.delete(`${API_URL}/users/${userId}/unfollow/${unfollowUserId}`);
        } catch (error) {
            throw error.response.data;
        }
    }
};