// src/store/chatStore.js
import { create } from 'zustand';
import api from '../services/api';

export const useChatStore = create((set, get) => ({
    chats: [],
    currentChat: null,
    messages: [],
    loading: false,
    sending: false,
    error: null,
    user: null,
    fetchingChats: {},
    // NEW: Chat suggestions state
    suggestions: [],
    suggestionsLoading: false,
    suggestionsError: null,

    setUser: (userData) => {
        set({ user: userData });
    },

    fetchChats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/chats');
            const chats = response.data.data?.chats || response.data.data || response.data;

            const { user } = get();
            if (!user) {
                try {
                    const userResponse = await api.get('/users/profile');
                    set({ user: userResponse.data.user || userResponse.data });
                } catch (userError) {
                    console.log('Could not fetch user data:', userError);
                }
            }

            set({ chats: Array.isArray(chats) ? chats : [], loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch chats';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    // NEW: Fetch chat suggestions
    fetchChatSuggestions: async () => {
        set({ suggestionsLoading: true, suggestionsError: null });
        try {
            const response = await api.get('/chats/suggestions');
            const suggestions = response.data.data?.suggestions || response.data.data || response.data;

            set({
                suggestions: Array.isArray(suggestions) ? suggestions : [],
                suggestionsLoading: false
            });
            return suggestions;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch chat suggestions';
            set({
                suggestionsError: errorMessage,
                suggestionsLoading: false
            });
            console.error('Error fetching suggestions:', error);
            return [];
        }
    },

    fetchUserProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            const userData = response.data.user || response.data;
            set({ user: userData });
            return userData;
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            throw error;
        }
    },

    createChat: async (chatData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/chats', chatData);
            const newChat = response.data.data?.chat || response.data.data || response.data;

            set(state => ({
                chats: [newChat, ...state.chats],
                currentChat: newChat,
                messages: newChat.messages || [],
                loading: false
            }));

            return newChat;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create chat';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    // UPDATED: Enhanced createChatWithSuggestion
    createChatWithSuggestion: async (suggestionData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/chats/create-with-suggestion', suggestionData);
            const data = response.data.data;
            const newChat = data?.chat || data || response.data;
            const initialMessage = data?.initialMessage;

            // Handle messages - could be from initialMessage or chat.messages
            let messages = [];
            if (initialMessage) {
                messages = [initialMessage];
            } else if (newChat.messages) {
                messages = newChat.messages;
            }

            set(state => ({
                chats: [newChat, ...state.chats],
                currentChat: newChat,
                messages: Array.isArray(messages) ? messages : [],
                loading: false
            }));

            return { chat: newChat, initialMessage, redirect: data?.redirect };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create chat with suggestion';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    fetchChat: async (chatId) => {
        const state = get();

        if (state.fetchingChats[chatId]) {
            console.log('Already fetching chat:', chatId);
            return state.currentChat;
        }

        if (state.currentChat?._id === chatId && state.messages.length > 0) {
            console.log('Chat already loaded:', chatId);
            return state.currentChat;
        }

        set(state => ({
            loading: true,
            error: null,
            fetchingChats: { ...state.fetchingChats, [chatId]: true }
        }));

        try {
            const response = await api.get(`/chats/${chatId}`);
            const data = response.data.data;
            const chat = data?.chat || data || response.data;
            const messages = data?.messages || chat.messages || [];

            console.log('Fetched chat data:', { chat, messages });

            set(state => ({
                currentChat: chat,
                messages: Array.isArray(messages) ? messages : [],
                loading: false,
                fetchingChats: { ...state.fetchingChats, [chatId]: false }
            }));

            return chat;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch chat';
            set(state => ({
                error: errorMessage,
                loading: false,
                fetchingChats: { ...state.fetchingChats, [chatId]: false }
            }));
            throw new Error(errorMessage);
        }
    },

    sendMessage: async (chatId, messageContent) => {
        set({ sending: true, error: null });

        const userMessage = {
            _id: `temp-${Date.now()}`,
            chatId,
            content: messageContent,
            sender: 'user',
            type: 'text',
            createdAt: new Date().toISOString(),
        };

        set(state => ({
            messages: [...state.messages, userMessage]
        }));

        try {
            const response = await api.post(`/chats/${chatId}/messages`, {
                content: messageContent
            });

            const responseData = response.data.data || response.data;

            let newMessages = [];
            if (responseData.messages) {
                newMessages = responseData.messages;
            } else if (Array.isArray(responseData)) {
                newMessages = responseData;
            } else if (responseData.userMessage && responseData.assistantMessage) {
                newMessages = [responseData.userMessage, responseData.assistantMessage];
            } else {
                newMessages = [...get().messages.filter(m => !m._id.startsWith('temp-')), responseData];
            }

            set({
                messages: Array.isArray(newMessages) ? newMessages : [...get().messages.filter(m => !m._id.startsWith('temp-')), responseData],
                sending: false
            });

            return responseData;
        } catch (error) {
            set(state => ({
                messages: state.messages.filter(m => !m._id.startsWith('temp-')),
                sending: false,
                error: error.response?.data?.message || 'Failed to send message'
            }));
            throw new Error(error.response?.data?.message || 'Failed to send message');
        }
    },

    updateChatTitle: async (chatId, newTitle) => {
        set({ loading: true, error: null });
        try {
            const response = await api.put(`/chats/${chatId}/title`, {
                title: newTitle
            });

            const updatedChat = response.data.data?.chat || response.data.data || response.data;

            set(state => ({
                chats: state.chats.map(chat =>
                    chat._id === chatId ? { ...chat, title: newTitle } : chat
                ),
                currentChat: state.currentChat?._id === chatId
                    ? { ...state.currentChat, title: newTitle }
                    : state.currentChat,
                loading: false
            }));

            return updatedChat;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update chat title';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    createProjectFromChat: async (chatId) => {
        const state = get();

        if (!state.messages || state.messages.length < 2) {
            throw new Error('Not enough conversation content to create a project. Please have a more detailed discussion first.');
        }

        const totalContentLength = state.messages.reduce((acc, msg) => acc + (msg.content?.length || 0), 0);
        if (totalContentLength < 100) {
            throw new Error('The conversation is too brief to extract meaningful project information. Please provide more details about your project idea.');
        }

        set({ loading: true, error: null });
        try {
            const response = await api.post(`/chats/${chatId}/create-project`);
            set({ loading: false });

            // Return the project data so the component can handle routing
            return {
                success: true,
                project: response.data.data.project,
                projectId: response.data.data.project._id
            };
        } catch (error) {
            set({ loading: false });
            if (error.response?.status === 429) {
                set({ error: "You have reached the daily limit for AI requests. Please try again tomorrow or upgrade your plan." });
                throw new Error("You have reached the daily limit for AI requests. Please try again tomorrow or upgrade your plan.");
            }
            if (error.response?.status === 503) {
                set({ error: "The AI service is currently overloaded. Please try again in a few minutes." });
                throw new Error("The AI service is currently overloaded. Please try again in a few minutes.");
            }
            const errorMessage = error.response?.data?.message || 'Failed to create project from chat';
            set({ error: errorMessage });
            if (error.response?.status === 400) {
                throw new Error('Unable to extract project information from the conversation. Please provide more specific project details in your chat.');
            }
            throw new Error(errorMessage);
        }
    },

    deleteChat: async (chatId) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/chats/${chatId}`);

            set(state => ({
                chats: state.chats.filter(chat => chat._id !== chatId),
                currentChat: state.currentChat?._id === chatId ? null : state.currentChat,
                messages: state.currentChat?._id === chatId ? [] : state.messages,
                loading: false,
                fetchingChats: { ...state.fetchingChats, [chatId]: false }
            }));

            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete chat';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
        }
    },

    setCurrentChat: (chat) => {
        set({
            currentChat: chat,
            messages: chat?.messages || []
        });
    },

    addMessage: (message) => {
        set(state => ({
            messages: [...state.messages, message]
        }));
    },

    clearCurrentChat: () => {
        set({
            currentChat: null,
            messages: []
        });
    },

    // NEW: Clear suggestions error
    clearSuggestionsError: () => set({ suggestionsError: null }),

    clearError: () => set({ error: null }),

    clearChats: () => set({
        chats: [],
        currentChat: null,
        messages: [],
        loading: false,
        sending: false,
        error: null,
        fetchingChats: {},
        suggestions: [],
        suggestionsLoading: false,
        suggestionsError: null
    })
}));