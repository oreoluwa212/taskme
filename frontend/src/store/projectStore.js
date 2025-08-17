// src/store/projectStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useProjectStore = create(
    persist(
        (set, get) => ({
            projects: [],
            loading: false,
            error: null,
            currentProject: null,
            initialized: false,
            lastFetch: null,

            pagination: {
                page: 1,
                pages: 1,
                total: 0,
                count: 0,
                limit: 10,
            },
            loadingMore: false,

            // Add stats state
            stats: {
                total: 0,
                pending: 0,
                inProgress: 0,
                completed: 0,
                averageProgress: 0,
                highPriorityCount: 0,
                overdueCount: 0,
                additionalStats: {
                    totalEstimatedHours: 0,
                    averageTimeline: 0,
                    projectsThisMonth: 0
                },
                categoryStats: []
            },
            statsLoading: false,
            statsError: null,
            lastStatsUpdate: null,

            // Get current project based on business logic
            getCurrentProject: () => {
                const { projects } = get();
                const projectsArray = Array.isArray(projects) ? projects : [];

                if (projectsArray.length === 0) return null;

                // Option 1: Most recent project that's not completed
                const activeProjects = projectsArray.filter(p => p.status !== 'Completed');
                if (activeProjects.length > 0) {
                    // Sort by creation date (most recent first) or due date (nearest first)
                    return activeProjects.sort((a, b) => {
                        // If both have due dates, sort by nearest due date
                        if (a.dueDate && b.dueDate) {
                            return new Date(a.dueDate) - new Date(b.dueDate);
                        }
                        // If only one has due date, prioritize it
                        if (a.dueDate) return -1;
                        if (b.dueDate) return 1;

                        // Fall back to creation date or progress
                        const aDate = new Date(a.createdAt || a.startDate);
                        const bDate = new Date(b.createdAt || b.startDate);
                        return bDate - aDate; // Most recent first
                    })[0];
                }

                // If no active projects, return the most recent one
                return projectsArray.sort((a, b) => {
                    const aDate = new Date(a.createdAt || a.startDate);
                    const bDate = new Date(b.createdAt || b.startDate);
                    return bDate - aDate;
                })[0];
            },

            // Alternative: Get current project based on highest priority + nearest due date
            getCurrentProjectByPriority: () => {
                const { projects } = get();
                const projectsArray = Array.isArray(projects) ? projects : [];

                if (projectsArray.length === 0) return null;

                const activeProjects = projectsArray.filter(p => p.status !== 'Completed');
                if (activeProjects.length === 0) return null;

                // Priority weights
                const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };

                return activeProjects.sort((a, b) => {
                    const aPriority = priorityWeight[a.priority] || 1;
                    const bPriority = priorityWeight[b.priority] || 1;

                    // First sort by priority
                    if (aPriority !== bPriority) {
                        return bPriority - aPriority; // Higher priority first
                    }

                    // Then by due date (nearest first)
                    if (a.dueDate && b.dueDate) {
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    }
                    if (a.dueDate) return -1;
                    if (b.dueDate) return 1;

                    // Finally by progress (less complete first)
                    return (a.progress || 0) - (b.progress || 0);
                })[0];
            },

            // Initialize store - prevents empty state flash
            initialize: async (force = false) => {
                const { initialized, lastFetch, projects } = get();

                // If already initialized and we have projects, and not forcing, return early
                if (initialized && Array.isArray(projects) && projects.length > 0 && !force) {
                    console.log('Store already initialized with projects, skipping');
                    return projects;
                }

                // Check cache timeout (5 minutes)
                const now = Date.now();
                if (lastFetch && (now - lastFetch) < 300000 && !force && Array.isArray(projects) && projects.length > 0) {
                    console.log('Using cached projects within timeout');
                    set({ initialized: true });
                    return projects;
                }

                console.log('Initializing store - fetching projects');
                return await get().fetchProjects();
            },

            fetchProjects: async (page = 1, showLoader = true, append = false) => {
                const currentState = get();

                // Set loading states
                if (showLoader && !append) {
                    set({
                        loading: true,
                        error: null
                    });
                } else if (append) {
                    set({
                        loadingMore: true,
                        error: null
                    });
                }

                console.log(`Fetching projects page ${page}, append: ${append}`);

                try {
                    const response = await api.get(`/projects?page=${page}&limit=${currentState.pagination.limit}`);
                    console.log('Fetch projects response:', response.data);

                    let projects = [];
                    let paginationData = {
                        page: 1,
                        pages: 1,
                        total: 0,
                        count: 0,
                        limit: currentState.pagination.limit,
                    };

                    if (response.data) {
                        // Extract projects data
                        if (response.data.data && Array.isArray(response.data.data)) {
                            projects = response.data.data;
                        } else if (Array.isArray(response.data)) {
                            projects = response.data;
                        } else if (response.data.projects && Array.isArray(response.data.projects)) {
                            projects = response.data.projects;
                        }

                        // Extract pagination data
                        if (response.data.success !== undefined) {
                            paginationData = {
                                page: response.data.page || 1,
                                pages: response.data.pages || 1,
                                total: response.data.total || projects.length,
                                count: response.data.count || projects.length,
                                limit: currentState.pagination.limit,
                            };
                        }
                    }

                    console.log('Setting projects in store:', projects.length, 'append:', append);

                    set({
                        projects: append ? [...currentState.projects, ...projects] : projects,
                        pagination: paginationData,
                        loading: false,
                        loadingMore: false,
                        initialized: true,
                        lastFetch: Date.now(),
                        error: null
                    });

                    return { projects, pagination: paginationData };
                } catch (error) {
                    console.error('Fetch projects error:', error);
                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to fetch projects';

                    set({
                        error: errorMessage,
                        loading: false,
                        loadingMore: false,
                        initialized: true,
                        lastFetch: Date.now()
                    });

                    throw error;
                }
            },

            // Load more projects (for infinite scroll or load more button)
            loadMoreProjects: async () => {
                const currentState = get();
                const nextPage = currentState.pagination.page + 1;

                if (nextPage <= currentState.pagination.pages) {
                    return await currentState.fetchProjects(nextPage, false, true);
                }

                return null; // No more pages to load
            },

            // Go to specific page
            goToPage: async (page) => {
                const currentState = get();
                if (page >= 1 && page <= currentState.pagination.pages) {
                    return await currentState.fetchProjects(page, true, false);
                }
                throw new Error('Invalid page number');
            },

            // Check if there are more pages to load
            hasMorePages: () => {
                const currentState = get();
                return currentState.pagination.page < currentState.pagination.pages;
            },

            // Reset pagination and fetch first page
            resetPagination: async () => {
                set({
                    projects: [],
                    pagination: {
                        page: 1,
                        pages: 1,
                        total: 0,
                        count: 0,
                        limit: get().pagination.limit,
                    }
                });
                return await get().fetchProjects(1, true, false);
            },

            // Update items per page
            setPageSize: async (limit) => {
                set({
                    pagination: {
                        ...get().pagination,
                        limit,
                        page: 1, // Reset to first page when changing page size
                    },
                    projects: [], // Clear current projects
                });
                return await get().fetchProjects(1, true, false);
            },

            // Fetch project stats from API
            fetchProjectStats: async () => {
                set({ statsLoading: true, statsError: null });

                try {
                    const response = await api.get('/projects/stats');
                    console.log('Fetch project stats response:', response.data);

                    const statsData = response.data.data || response.data;

                    set({
                        stats: {
                            total: statsData.total || 0,
                            pending: statsData.pending || 0,
                            inProgress: statsData.inProgress || 0,
                            completed: statsData.completed || 0,
                            averageProgress: statsData.averageProgress || 0,
                            highPriorityCount: statsData.highPriorityCount || 0,
                            overdueCount: statsData.overdueCount || 0,
                            additionalStats: {
                                totalEstimatedHours: statsData.additionalStats?.totalEstimatedHours || 0,
                                averageTimeline: statsData.additionalStats?.averageTimeline || 0,
                                projectsThisMonth: statsData.additionalStats?.projectsThisMonth || 0
                            },
                            categoryStats: statsData.categoryStats || []
                        },
                        statsLoading: false,
                        lastStatsUpdate: Date.now()
                    });

                    return get().stats;
                } catch (error) {
                    console.error('Fetch project stats error:', error);
                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to fetch project stats';

                    set({
                        statsError: errorMessage,
                        statsLoading: false
                    });

                    // Return calculated stats as fallback
                    return get().getProjectStats();
                }
            },

            // Calculate stats from current projects (fallback)
            getProjectStats: () => {
                const { projects } = get();
                const projectsArray = Array.isArray(projects) ? projects : [];

                const stats = {
                    total: projectsArray.length,
                    pending: projectsArray.filter(p => p.status === 'Pending').length,
                    inProgress: projectsArray.filter(p => p.status === 'In Progress').length,
                    completed: projectsArray.filter(p => p.status === 'Completed').length,
                    averageProgress: projectsArray.length > 0
                        ? Math.round(projectsArray.reduce((acc, p) => acc + (p.progress || 0), 0) / projectsArray.length)
                        : 0,
                    highPriorityCount: projectsArray.filter(p => p.priority === 'High').length,
                    overdueCount: projectsArray.filter(p => {
                        if (!p.dueDate) return false;
                        return new Date(p.dueDate) < new Date() && p.status !== 'Completed';
                    }).length,
                    additionalStats: {
                        totalEstimatedHours: projectsArray.reduce((acc, p) => acc + (p.subtaskStats?.totalEstimatedHours || 0), 0),
                        averageTimeline: projectsArray.length > 0
                            ? Math.round(projectsArray.reduce((acc, p) => acc + (p.timeline || 0), 0) / projectsArray.length * 10) / 10
                            : 0,
                        projectsThisMonth: projectsArray.filter(p => {
                            if (!p.createdAt) return false;
                            const projectDate = new Date(p.createdAt);
                            const now = new Date();
                            return projectDate.getMonth() === now.getMonth() && projectDate.getFullYear() === now.getFullYear();
                        }).length
                    },
                    categoryStats: []
                };

                return stats;
            },

            // Fetch single project by ID
            fetchProjectById: async (projectId) => {
                set({ loading: true, error: null });

                try {
                    console.log('Fetching project by ID:', projectId);
                    const response = await api.get(`/projects/${projectId}`);
                    console.log('Fetch project by ID response:', response.data);

                    const projectData = response.data?.data || response.data;

                    set({
                        currentProject: projectData?.project || projectData,
                        loading: false,
                        error: null
                    });

                    return projectData;
                } catch (error) {
                    console.error('Fetch project by ID error:', error);
                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to fetch project';

                    set({
                        error: errorMessage,
                        loading: false,
                        currentProject: null
                    });

                    throw error;
                }
            },

            // Create project with optimistic update
            createProject: async (projectData) => {
                set({ loading: true, error: null });

                try {
                    console.log('Creating project with data:', projectData);
                    const response = await api.post('/projects', projectData);
                    console.log('Create project response:', response.data);

                    const newProject = response.data?.data || response.data;

                    set(state => ({
                        projects: Array.isArray(state.projects)
                            ? [...state.projects, newProject]
                            : [newProject],
                        loading: false,
                        lastFetch: Date.now()
                    }));

                    // Refresh stats after creating project
                    get().fetchProjectStats();

                    return newProject;
                } catch (error) {
                    console.error('Create project error:', error);
                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to create project';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Update project with optimistic update
            updateProject: async (projectId, projectData) => {
                set(state => ({
                    projects: Array.isArray(state.projects)
                        ? state.projects.map(p =>
                            (p.id === projectId || p._id === projectId)
                                ? { ...p, ...projectData }
                                : p
                        )
                        : [],
                    currentProject: state.currentProject &&
                        (state.currentProject.id === projectId || state.currentProject._id === projectId)
                        ? { ...state.currentProject, ...projectData }
                        : state.currentProject
                }));

                try {
                    console.log('Updating project:', projectId, projectData);
                    const response = await api.put(`/projects/${projectId}`, projectData);
                    console.log('Update project response:', response.data);

                    const updatedProject = response.data?.data || response.data;

                    set(state => ({
                        projects: Array.isArray(state.projects)
                            ? state.projects.map(p =>
                                (p.id === projectId || p._id === projectId)
                                    ? { ...p, ...updatedProject }
                                    : p
                            )
                            : [updatedProject],
                        currentProject: state.currentProject &&
                            (state.currentProject.id === projectId || state.currentProject._id === projectId)
                            ? { ...state.currentProject, ...updatedProject }
                            : state.currentProject,
                        loading: false,
                        lastFetch: Date.now()
                    }));

                    // Refresh stats after updating project
                    get().fetchProjectStats();

                    return updatedProject;
                } catch (error) {
                    console.error('Update project error:', error);
                    await get().fetchProjects(false);

                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to update project';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Update project progress with optimistic update
            updateProjectProgress: async (projectId, progress) => {
                set(state => ({
                    projects: Array.isArray(state.projects)
                        ? state.projects.map(p =>
                            (p.id === projectId || p._id === projectId)
                                ? { ...p, progress }
                                : p
                        )
                        : [],
                    currentProject: state.currentProject &&
                        (state.currentProject.id === projectId || state.currentProject._id === projectId)
                        ? { ...state.currentProject, progress }
                        : state.currentProject
                }));

                try {
                    const response = await api.patch(`/projects/${projectId}/progress`, { progress });
                    console.log('Update progress response:', response.data);

                    const updatedProject = response.data?.data || response.data;

                    set(state => ({
                        projects: Array.isArray(state.projects)
                            ? state.projects.map(p =>
                                (p.id === projectId || p._id === projectId)
                                    ? { ...p, progress }
                                    : p
                            )
                            : [updatedProject],
                        currentProject: state.currentProject &&
                            (state.currentProject.id === projectId || state.currentProject._id === projectId)
                            ? { ...state.currentProject, progress }
                            : state.currentProject,
                        loading: false,
                        lastFetch: Date.now()
                    }));

                    // Refresh stats after updating progress
                    get().fetchProjectStats();

                    return updatedProject;
                } catch (error) {
                    console.error('Update project progress error:', error);
                    await get().fetchProjects(false);

                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to update project progress';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Delete project with optimistic update
            deleteProject: async (projectId) => {
                set(state => ({
                    projects: Array.isArray(state.projects)
                        ? state.projects.filter(p => p.id !== projectId && p._id !== projectId)
                        : [],
                    currentProject: state.currentProject &&
                        (state.currentProject.id === projectId || state.currentProject._id === projectId)
                        ? null
                        : state.currentProject
                }));

                try {
                    await api.delete(`/projects/${projectId}`);
                    console.log('Project deleted successfully');

                    set(state => ({
                        loading: false,
                        lastFetch: Date.now()
                    }));

                    // Refresh stats after deleting project
                    get().fetchProjectStats();

                    return true;
                } catch (error) {
                    console.error('Delete project error:', error);
                    await get().fetchProjects(false);

                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to delete project';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Reset store completely
            resetStore: () => {
                console.log('Resetting project store');
                set({
                    projects: [],
                    loading: false,
                    error: null,
                    currentProject: null,
                    initialized: false,
                    lastFetch: null,
                    stats: {
                        total: 0,
                        pending: 0,
                        inProgress: 0,
                        completed: 0,
                        averageProgress: 0,
                        highPriorityCount: 0,
                        overdueCount: 0,
                        additionalStats: {
                            totalEstimatedHours: 0,
                            averageTimeline: 0,
                            projectsThisMonth: 0
                        },
                        categoryStats: []
                    },
                    statsLoading: false,
                    statsError: null,
                    lastStatsUpdate: null
                });
            },

            // Clear current project
            clearCurrentProject: () => {
                set({ currentProject: null });
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },

            // Clear stats error
            clearStatsError: () => {
                set({ statsError: null });
            },

            // Set loading state
            setLoading: (loading) => {
                console.log('Setting loading state:', loading);
                set({ loading });
            }
        }),
        {
            name: 'project-store',
            partialize: (state) => ({
                projects: state.projects,
                initialized: state.initialized,
                lastFetch: state.lastFetch,
                stats: state.stats,
                lastStatsUpdate: state.lastStatsUpdate
            })
        }
    )
);