import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8080${imagePath}`;
};

export const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const userData = response.data;
            if (userData.profilePicture) {
                userData.profilePicture = getFullImageUrl(userData.profilePicture);
            }
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
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

    logout: async () => {
        try {
            // Clear local storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            
            // Call backend logout endpoint if you have one
            await axios.post('http://localhost:8080/api/auth/logout');
            
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local storage even if backend call fails
            localStorage.clear();
            return false;
        }
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    updateProfile: async (userId, userData) => {
        try {
            let response;
            if (userData.profileImage) {
                const formData = new FormData();
                Object.keys(userData).forEach(key => {
                    formData.append(key, userData[key]);
                });
                
                response = await axios.put(`${API_URL}/users/${userId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                response = await axios.put(`${API_URL}/users/${userId}`, userData);
            }
            const updatedUser = response.data;
            if (updatedUser.profilePicture) {
                updatedUser.profilePicture = getFullImageUrl(updatedUser.profilePicture);
            }
            return updatedUser;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    updateOAuthProfile: async (formData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        return await response.json();
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