// src/components/chats/ChatSuggestions.js
import React, { useEffect, useState } from "react";
import { useChatStore } from "../../store/chatStore";
import { toast } from "react-toastify";
import Button from "../ui/Button"; // Import the UI Button
import {
  Lightbulb,
  Plus,
  Loader2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const ChatSuggestions = ({ onChatCreated, className = "" }) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [customTitle, setCustomTitle] = useState("");
  const [showCustomTitle, setShowCustomTitle] = useState(false);

  const {
    suggestions,
    suggestionsLoading,
    suggestionsError,
    loading,
    fetchChatSuggestions,
    createChatWithSuggestion,
    clearSuggestionsError,
  } = useChatStore();

  useEffect(() => {
    fetchChatSuggestions();
  }, [fetchChatSuggestions]);

  useEffect(() => {
    if (suggestionsError) {
      toast.error(suggestionsError);
      clearSuggestionsError();
    }
  }, [suggestionsError, clearSuggestionsError]);

  const handleSuggestionClick = async (suggestion, useCustomTitle = false) => {
    setSelectedSuggestion(suggestion);

    if (useCustomTitle && !showCustomTitle) {
      setShowCustomTitle(true);
      setCustomTitle(suggestion.title);
      return;
    }

    try {
      const chatData = {
        suggestionId: suggestion.id || suggestion._id, // Handle both id formats
        customTitle: useCustomTitle ? customTitle : suggestion.title,
        chatType: suggestion.chatType || suggestion.type, // Handle both field names
        autoStart: suggestion.autoStart !== false, // Default to true
        category: suggestion.category,
        prompt: suggestion.prompt, // Include the prompt from API
      };

      const result = await createChatWithSuggestion(chatData);

      toast.success(`Chat "${result.chat.title}" created successfully!`);

      if (onChatCreated) {
        onChatCreated(result.chat);
      }

      // Reset state
      setSelectedSuggestion(null);
      setShowCustomTitle(false);
      setCustomTitle("");
    } catch (error) {
      console.error("Error creating chat from suggestion:", error);
      toast.error(error.message || "Failed to create chat");
      setSelectedSuggestion(null);
    }
  };

  const getChatTypeIcon = (type) => {
    const iconMap = {
      project_creation: "🚀",
      project_management: "📊",
      task_generation: "📋",
      learning_journey: "🎓",
      productivity_planning: "⚡",
      career_development: "💼",
      goal_setting: "🎯",
      time_management: "⏰",
      team_collaboration: "👥",
      risk_assessment: "⚠️",
      marketing_campaign: "📢",
      event_planning: "📅",
      business_strategy: "💡",
      personal_development: "🌱",
      general: "💬",
    };
    return iconMap[type] || "💬";
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      Work: "bg-blue-100 text-blue-700 border-blue-200",
      Personal: "bg-green-100 text-green-700 border-green-200",
      Learning: "bg-purple-100 text-purple-700 border-purple-200",
      Business: "bg-orange-100 text-orange-700 border-orange-200",
      Creative: "bg-pink-100 text-pink-700 border-pink-200",
      Health: "bg-teal-100 text-teal-700 border-teal-200",
      Technology: "bg-indigo-100 text-indigo-700 border-indigo-200", // Added Technology category
      Other: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colorMap[category] || colorMap["Other"];
  };

  const handleRefresh = () => {
    fetchChatSuggestions();
  };

  const handleCustomTitleSubmit = (e) => {
    e.preventDefault();
    if (selectedSuggestion && customTitle.trim()) {
      handleSuggestionClick(selectedSuggestion, true);
    }
  };

  const cancelCustomTitle = () => {
    setShowCustomTitle(false);
    setSelectedSuggestion(null);
    setCustomTitle("");
  };

  // FIXED: Proper extraction of suggestions from API response
  const extractSuggestions = () => {
    console.log("Raw suggestions from store:", suggestions);

    // Handle different possible API response structures
    if (!suggestions) {
      return [];
    }

    // Case 1: suggestions.trending exists (your current API structure)
    if (suggestions.trending && Array.isArray(suggestions.trending)) {
      console.log("Found trending suggestions:", suggestions.trending);
      return suggestions.trending;
    }

    // Case 2: suggestions.suggestions exists
    if (suggestions.suggestions && Array.isArray(suggestions.suggestions)) {
      return suggestions.suggestions;
    }

    // Case 3: suggestions is directly an array
    if (Array.isArray(suggestions)) {
      return suggestions;
    }

    // Case 4: suggestions.data exists
    if (suggestions.data && Array.isArray(suggestions.data)) {
      return suggestions.data;
    }

    console.log("No valid suggestions array found");
    return [];
  };

  const allSuggestions = extractSuggestions();
  console.log("Extracted suggestions for rendering:", allSuggestions);

  if (suggestionsLoading && allSuggestions.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading personalized suggestions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Trending Suggestions
          </h3>
          {allSuggestions.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {allSuggestions.length}
            </span>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          disabled={suggestionsLoading}
          variant="ghost"
          size="sm"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          title="Refresh suggestions"
        >
          <RefreshCw
            className={`h-4 w-4 ${suggestionsLoading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {/* Custom Title Input */}
      {showCustomTitle && selectedSuggestion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <form onSubmit={handleCustomTitleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="customTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Customize chat title:
              </label>
              <input
                id="customTitle"
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a custom title..."
                autoFocus
              />
            </div>
            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={!customTitle.trim() || loading}
                loading={loading && selectedSuggestion}
                variant="primary"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Chat</span>
              </Button>
              <Button
                type="button"
                onClick={cancelCustomTitle}
                variant="secondary"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Suggestions Grid */}
      {allSuggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSuggestions.map((suggestion) => (
            <div
              key={suggestion.id || suggestion._id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
            >
              {/* Header with Category Badge and Icon */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                    suggestion.category
                  )}`}
                >
                  {suggestion.category}
                </span>
                <div className="flex items-center space-x-1">
                  {suggestion.isPersonalized && (
                    <Sparkles
                      className="h-3 w-3 text-yellow-500"
                      title="Personalized"
                    />
                  )}
                  <span className="text-lg">
                    {getChatTypeIcon(suggestion.chatType || suggestion.type)}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {suggestion.title}
              </h4>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {suggestion.description}
              </p>

              {/* Estimated Time */}
              {suggestion.estimatedTime && (
                <div className="text-xs text-gray-500 mb-4 flex items-center space-x-1">
                  <span>⏱️</span>
                  <span>{suggestion.estimatedTime}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={
                    loading &&
                    (selectedSuggestion?.id === suggestion.id ||
                      selectedSuggestion?._id === suggestion._id)
                  }
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                >
                  {loading &&
                  (selectedSuggestion?.id === suggestion.id ||
                    selectedSuggestion?._id === suggestion._id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Start</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleSuggestionClick(suggestion, true)}
                  disabled={loading}
                  className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Customize title"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Lightbulb className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No suggestions available
          </h3>
          <p className="text-gray-600 mb-4">
            We're still learning about your preferences. Create some chats to
            get personalized suggestions!
          </p>
          <button
            onClick={handleRefresh}
            disabled={suggestionsLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {suggestionsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSuggestions;
