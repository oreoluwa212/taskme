// src/store/userStore.js
import { create } from 'zustand';
import api from '../services/api';

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    error: null,

    // UI state for operations
    uploading: false,
    updating: false,
    changingPassword: false,

    // Fetch user profile
    fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/users/profile');
            set({ user: response.data.data, loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        set({ updating: true, error: null });
        try {
            const response = await api.put('/users/profile', profileData);

            // Update the user state with the new data
            set(state => ({
                user: { ...state.user, ...response.data.data },
                updating: false
            }));

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            set({ error: errorMessage, updating: false });
            throw new Error(errorMessage);
        }
    },

    // Change password
    changePassword: async (passwordData) => {
        set({ changingPassword: true, error: null });
        try {
            const response = await api.put('/users/change-password', passwordData);
            set({ changingPassword: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to change password';
            set({ error: errorMessage, changingPassword: false });
            throw new Error(errorMessage);
        }
    },

    // Upload avatar
    uploadAvatar: async (avatarFile) => {
        set({ uploading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const response = await api.post('/users/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            // Update the user's avatar in the state
            set(state => ({
                user: {
                    ...state.user,
                    avatar: response.data.data.avatar
                },
                uploading: false
            }));

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to upload avatar';
            set({ error: errorMessage, uploading: false });
            throw new Error(errorMessage);
        }
    },

    // Delete avatar
    deleteAvatar: async () => {
        set({ uploading: true, error: null });
        try {
            const response = await api.delete('/users/avatar');

            // Remove avatar from user state
            set(state => ({
                user: {
                    ...state.user,
                    avatar: null
                },
                uploading: false
            }));

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete avatar';
            set({ error: errorMessage, uploading: false });
            throw new Error(errorMessage);
        }
    },

    // Update specific user field (for real-time updates)
    updateUserField: (field, value) => {
        set(state => ({
            user: {
                ...state.user,
                [field]: value
            }
        }));
    },

    // Clear user data
    clearUser: () => set({
        user: null,
        error: null,
        loading: false,
        uploading: false,
        updating: false,
        changingPassword: false
    }),

    // Clear error
    clearError: () => set({ error: null }),
}));