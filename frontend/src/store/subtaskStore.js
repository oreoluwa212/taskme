// src/store/subtaskStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useSubtaskStore = create(
    persist(
        (set, get) => ({
            // State
            subtasks: [],
            subtaskStats: null,
            loading: false,
            error: null,
            generatingSubtasks: false,
            recentSubtasks: [],
            overdueSubtasks: [],
            weeklyProductivity: [],

            // Actions
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            setGeneratingSubtasks: (generating) => set({ generatingSubtasks: generating }),

            // Get subtasks by project ID (selector)
            getSubtasksByProjectId: (projectId) => {
                const state = get();
                return state.subtasks.filter(subtask =>
                    (subtask.projectId === projectId || subtask.project === projectId)
                );
            },

            // Generate AI subtasks for a project
            generateAISubtasks: async (projectId, regenerate = false) => {
                set({ generatingSubtasks: true, error: null });
                try {
                    const response = await api.post(`/subtasks/projects/${projectId}/generate`, {
                        regenerate,
                    });

                    // Handle response structure based on your API
                    const responseData = response.data;
                    const newSubtasks = responseData.data || responseData.subtasks || responseData;

                    // Update subtasks for this project
                    set((state) => ({
                        subtasks: [
                            ...state.subtasks.filter(subtask =>
                                subtask.projectId !== projectId &&
                                subtask.project !== projectId
                            ),
                            ...(Array.isArray(newSubtasks) ? newSubtasks : [])
                        ],
                        generatingSubtasks: false,
                    }));

                    return newSubtasks;
                } catch (error) {
                    console.error('Generate AI subtasks error:', error);
                    set({
                        error: error.response?.data?.message || 'Failed to generate subtasks',
                        generatingSubtasks: false
                    });
                    throw error;
                }
            },

            // Get all subtasks for a project
            getProjectSubtasks: async (projectId) => {
                set({ loading: true, error: null });
                try {
                    const response = await api.get(`/subtasks/projects/${projectId}`);
                    console.log('API Response:', response.data);

                    const responseData = response.data;
                    // Based on your API response structure: { success: true, count: 17, progress: 0, data: [...] }
                    const projectSubtasks = responseData.data || responseData.subtasks || responseData;

                    if (!Array.isArray(projectSubtasks)) {
                        console.warn('Expected subtasks to be an array, got:', projectSubtasks);
                        set({ loading: false, error: 'Invalid data format received' });
                        return [];
                    }

                    // Update subtasks for this project
                    set((state) => ({
                        subtasks: [
                            ...state.subtasks.filter(subtask =>
                                subtask.projectId !== projectId &&
                                subtask.project !== projectId
                            ),
                            ...projectSubtasks
                        ],
                        loading: false,
                        // Store additional metadata
                        subtaskStats: {
                            count: responseData.count,
                            progress: responseData.progress,
                            success: responseData.success
                        }
                    }));

                    return projectSubtasks;
                } catch (error) {
                    console.error('Get project subtasks error:', error);
                    set({
                        error: error.response?.data?.message || 'Failed to fetch subtasks',
                        loading: false
                    });
                    throw error;
                }
            },

            // Create a new subtask
            createSubtask: async (projectId, subtaskData) => {
                set({ loading: true, error: null });
                try {
                    const response = await api.post(`/subtasks/projects/${projectId}`, subtaskData);
                    const responseData = response.data;
                    const newSubtask = responseData.data?.subtask || responseData.subtask || responseData;

                    set((state) => ({
                        subtasks: [...state.subtasks, newSubtask],
                        loading: false,
                    }));

                    return newSubtask;
                } catch (error) {
                    console.error('Create subtask error:', error);
                    set({
                        error: error.response?.data?.message || 'Failed to create subtask',
                        loading: false
                    });
                    throw error;
                }
            },

            // Update a subtask
            updateSubtask: async (subtaskId, updateData) => {
                set({ loading: true, error: null });
                try {
                    const response = await api.put(`/subtasks/${subtaskId}`, updateData);
                    const responseData = response.data;
                    const updatedSubtask = responseData.data?.subtask || responseData.subtask || responseData;

                    set((state) => ({
                        subtasks: state.subtasks.map(subtask =>
                            (subtask.id === subtaskId || subtask._id === subtaskId)
                                ? { ...subtask, ...updatedSubtask }
                                : subtask
                        ),
                        loading: false,
                    }));

                    return updatedSubtask;
                } catch (error) {
                    console.error('Update subtask error:', error);
                    set({
                        error: error.response?.data?.message || 'Failed to update subtask',
                        loading: false
                    });
                    throw error;
                }
            },

            // Delete a subtask
            deleteSubtask: async (subtaskId) => {
                set({ loading: true, error: null });
                try {
                    await api.delete(`/subtasks/${subtaskId}`);

                    set((state) => ({
                        subtasks: state.subtasks.filter(subtask =>
                            subtask.id !== subtaskId && subtask._id !== subtaskId
                        ),
                        loading: false,
                    }));

                    return true;
                } catch (error) {
                    console.error('Delete subtask error:', error);
                    set({
                        error: error.response?.data?.message || 'Failed to delete subtask',
                        loading: false
                    });
                    throw error;
                }
            },

            // Get subtask statistics
            getSubtaskStats: async () => {
                set({ loading: true, error: null });
                try {
                    const response = await api.get('/subtasks/stats');
                    const responseData = response.data;
                    const stats = responseData.stats || responseData.data?.stats || responseData;

                    set({
                        subtaskStats: stats,
                        loading: false
                    });

                    return stats;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to fetch subtask stats',
                        loading: false
                    });
                    throw error;
                }
            },

            // Get subtasks for a specific project (from local state)
            getSubtasksByProjectId: (projectId) => {
                return get().subtasks.filter(subtask =>
                    subtask.projectId === projectId || subtask.project === projectId
                );
            },
            // Get recent subtasks with daily grouping
            getRecentSubtasks: async (params = {}) => {
                set({ loading: true, error: null });
                try {
                    const queryParams = new URLSearchParams({
                        page: params.page || 1,
                        limit: params.limit || 10,
                        groupBy: params.groupBy || 'day',
                        sortBy: params.sortBy || 'createdAt',
                        sortOrder: params.sortOrder || 'desc',
                        ...params
                    });

                    const response = await api.get(`/subtasks/stats?${queryParams}`);
                    const recentData = response.data.data || response.data;

                    set({
                        recentSubtasks: recentData,
                        loading: false
                    });

                    return recentData;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to fetch recent subtasks',
                        loading: false
                    });
                    throw error;
                }
            },

            // Get overdue tasks
            getOverdueSubtasks: async (params = {}) => {
                set({ loading: true, error: null });
                try {
                    const queryParams = new URLSearchParams({
                        dueDateTo: params.dueDateTo || new Date().toISOString().split('T')[0],
                        includeCompleted: params.includeCompleted || false,
                        ...params
                    });

                    const response = await api.get(`/subtasks/stats?${queryParams}`);
                    const overdueData = response.data.data || response.data;

                    set({
                        overdueSubtasks: overdueData,
                        loading: false
                    });

                    return overdueData;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to fetch overdue subtasks',
                        loading: false
                    });
                    throw error;
                }
            },

            // Get weekly productivity data
            getWeeklyProductivity: async (params = {}) => {
                set({ loading: true, error: null });
                try {
                    const queryParams = new URLSearchParams({
                        groupBy: 'week',
                        sortBy: params.sortBy || 'dueDate',
                        limit: params.limit || 50,
                        ...params
                    });

                    const response = await api.get(`/subtasks/stats?${queryParams}`);
                    const weeklyData = response.data.data || response.data;

                    set({
                        weeklyProductivity: weeklyData,
                        loading: false
                    });

                    return weeklyData;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to fetch weekly productivity',
                        loading: false
                    });
                    throw error;
                }
            },

            // Get filtered subtasks by date range and status
            getFilteredSubtasks: async (params = {}) => {
                set({ loading: true, error: null });
                try {
                    const queryParams = new URLSearchParams(params);
                    const response = await api.get(`/subtasks/stats?${queryParams}`);
                    const filteredData = response.data.data || response.data;

                    set({ loading: false });
                    return filteredData;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to fetch filtered subtasks',
                        loading: false
                    });
                    throw error;
                }
            },

            loadDashboardSubtasks: async (params = {}) => {
                set({ loading: true, error: null });
                try {
                    const queryParams = new URLSearchParams({
                        status: JSON.stringify(["Pending", "In Progress"]),
                        sortBy: "dueDate",
                        sortOrder: "asc",
                        limit: 50,
                        ...params
                    });

                    const response = await api.get(`/subtasks/stats?${queryParams}`);
                    const responseData = response.data;
                    // Handle your API's nested structure: data.subtasks
                    const subtasksData = responseData.data?.subtasks || responseData.subtasks || responseData.data || responseData;

                    if (Array.isArray(subtasksData)) {
                        set({ subtasks: subtasksData, loading: false });
                    } else {
                        console.warn('Expected subtasks array, got:', subtasksData);
                        set({ loading: false });
                    }

                    return subtasksData;
                } catch (error) {
                    console.error('Load dashboard subtasks error:', error);
                    set({
                        error: error.response?.data?.message || 'Failed to load dashboard subtasks',
                        loading: false
                    });
                    throw error;
                }
            },

            // Clear subtasks for a project
            clearProjectSubtasks: (projectId) => {
                set((state) => ({
                    subtasks: state.subtasks.filter(subtask =>
                        subtask.projectId !== projectId && subtask.project !== projectId
                    )
                }));
            },

            // Clear all subtasks
            clearAllSubtasks: () => set({ subtasks: [], subtaskStats: null }),

            // Mark subtask as complete
            markSubtaskComplete: async (subtaskId) => {
                return get().updateSubtask(subtaskId, { status: 'Completed' });
            },

            // Mark subtask as pending
            markSubtaskPending: async (subtaskId) => {
                return get().updateSubtask(subtaskId, { status: 'Pending' });
            },

            // Mark subtask as in progress
            markSubtaskInProgress: async (subtaskId) => {
                return get().updateSubtask(subtaskId, { status: 'In Progress' });
            },
        }),
        {
            name: 'subtask-store',
            partialize: (state) => ({
                subtasks: state.subtasks,
                subtaskStats: state.subtaskStats,
                recentSubtasks: state.recentSubtasks,
                overdueSubtasks: state.overdueSubtasks,
                weeklyProductivity: state.weeklyProductivity,
            }),
        }
    )
);

export default useSubtaskStore;