// src/components/chat/ChatSidebar.jsx
import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  FolderPlus,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import Button from "../ui/Button";

const ChatSidebar = ({
  chats = [],
  loading = false,
  selectedChatId,
  onSelectChat,
  onCreateChat,
  onEditTitle,
  onDeleteChat,
  onCreateProject,
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
  onClose,
  className = "",
}) => {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleEditStart = (chat) => {
    setEditingChatId(chat._id);
    setEditTitle(chat.title || "");
  };

  const handleEditSubmit = async (chatId) => {
    if (!editTitle.trim()) {
      setEditingChatId(null);
      return;
    }

    await onEditTitle(chatId, editTitle);
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleKeyPress = (e, chatId) => {
    if (e.key === "Enter") {
      handleEditSubmit(chatId);
    } else if (e.key === "Escape") {
      setEditingChatId(null);
      setEditTitle("");
    }
  };

  const sidebarWidth = isCollapsed ? "w-16" : isMobile ? "w-80" : "w-80";

  return (
    <div
      className={`bg-gray-50 overflow-hidden border-r border-gray-200 flex flex-col h-full 
        transition-all duration-300 ${sidebarWidth} ${className}
        ${isMobile ? "shadow-xl" : ""}`}
    >
      {/* Header */}
      <SidebarHeader
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        onCreateChat={onCreateChat}
        onToggleCollapse={onToggleCollapse}
        onClose={onClose}
      />

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <ChatList
          chats={chats}
          loading={loading}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          selectedChatId={selectedChatId}
          editingChatId={editingChatId}
          editTitle={editTitle}
          onSelectChat={onSelectChat}
          onEditStart={handleEditStart}
          onEditChange={setEditTitle}
          onEditSubmit={handleEditSubmit}
          onEditKeyPress={handleKeyPress}
          onDeleteChat={onDeleteChat}
          onCreateProject={onCreateProject}
        />
      </div>

      {/* Footer (Mobile only) */}
      {isMobile && !isCollapsed && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="text-xs text-gray-500 text-center">
            TaskMe AI • Chat with AI Assistant
          </div>
        </div>
      )}
    </div>
  );
};

// SidebarHeader Component
const SidebarHeader = ({
  isCollapsed,
  isMobile,
  onCreateChat,
  onToggleCollapse,
  onClose,
}) => (
  <div className="p-4 border-b border-gray-200 bg-white">
    <div className="flex items-center justify-between">
      {!isCollapsed && (
        <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <MessageSquare size={20} className="text-blue-600" />
          <span>Chats</span>
        </h2>
      )}

      <div className="flex items-center space-x-2">
        <Button
          onClick={onCreateChat}
          variant="ghost"
          size="sm"
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          title={isCollapsed ? "New Chat" : "Create New Chat"}
        >
          <Plus size={20} />
        </Button>

        {/* Desktop collapse toggle */}
        {!isMobile && onToggleCollapse && (
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </Button>
        )}

        {/* Mobile close button */}
        {isMobile && onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
            title="Close Sidebar"
          >
            <X size={20} />
          </Button>
        )}
      </div>
    </div>
  </div>
);

// ChatList Component
const ChatList = ({
  chats,
  loading,
  isCollapsed,
  isMobile,
  selectedChatId,
  editingChatId,
  editTitle,
  onSelectChat,
  onEditStart,
  onEditChange,
  onEditSubmit,
  onEditKeyPress,
  onDeleteChat,
  onCreateProject,
}) => {
  if (loading && chats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        {!isCollapsed && <div className="mt-2">Loading chats...</div>}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      !isCollapsed && (
        <div className="p-4 text-center text-gray-500">
          <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm">No chats yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Create your first chat to get started!
          </p>
        </div>
      )
    );
  }

  return (
    <div className="p-2">
      {chats.map((chat) => (
        <ChatItem
          key={chat._id}
          chat={chat}
          isSelected={selectedChatId === chat._id}
          isEditing={editingChatId === chat._id}
          editTitle={editTitle}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onSelect={() => onSelectChat(chat)}
          onEditStart={() => onEditStart(chat)}
          onEditChange={onEditChange}
          onEditSubmit={() => onEditSubmit(chat._id)}
          onEditKeyPress={(e) => onEditKeyPress(e, chat._id)}
          onDelete={() => onDeleteChat(chat._id)}
          onCreateProject={() => onCreateProject(chat._id)}
        />
      ))}
    </div>
  );
};

// ChatItem Component
const ChatItem = ({
  chat,
  isSelected,
  isEditing,
  editTitle,
  isCollapsed,
  isMobile,
  onSelect,
  onEditStart,
  onEditChange,
  onEditSubmit,
  onEditKeyPress,
  onDelete,
  onCreateProject,
}) => {
  const handleClick = (e) => {
    if (isEditing) return;
    onSelect();
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = now - date;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "Today";
      if (diffDays === 2) return "Yesterday";
      if (diffDays <= 7) return `${diffDays - 1} days ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return "";
    }
  };

  return (
    <div
      className={`group flex items-center justify-between p-3 rounded-lg 
        cursor-pointer transition-all duration-200 mb-1 ${
          isSelected
            ? "bg-blue-100 border-l-4 border-blue-600 shadow-sm"
            : "hover:bg-gray-100 hover:shadow-sm"
        } ${isEditing ? "ring-2 ring-blue-500" : ""}`}
      onClick={handleClick}
      title={isCollapsed ? chat.title || "Untitled Chat" : ""}
    >
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => onEditChange(e.target.value)}
            onBlur={onEditSubmit}
            onKeyPress={onEditKeyPress}
            className="w-full px-2 py-1 border rounded-md focus:outline-none 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        ) : (
          <>
            {!isCollapsed && (
              <>
                <h3 className="font-medium text-gray-900 truncate mb-1">
                  {chat.title || "Untitled Chat"}
                </h3>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  <span>{formatDate(chat.updatedAt)}</span>
                </div>
              </>
            )}

            {isCollapsed && (
              <div
                className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 
                rounded-full flex items-center justify-center text-blue-600 
                font-semibold text-sm shadow-sm"
              >
                {(chat.title || "U")[0].toUpperCase()}
              </div>
            )}
          </>
        )}
      </div>

      {!isCollapsed && (
        <div
          className={`flex items-center space-x-1 transition-opacity ${
            isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <ActionButton
            onClick={(e) => handleActionClick(e, onEditStart)}
            icon={Edit2}
            className="text-gray-400 hover:text-gray-600"
            title="Edit chat title"
          />
          <ActionButton
            onClick={(e) => handleActionClick(e, onCreateProject)}
            icon={FolderPlus}
            className="text-gray-400 hover:text-green-600"
            title="Create project from chat"
          />
          <ActionButton
            onClick={(e) => handleActionClick(e, onDelete)}
            icon={Trash2}
            className="text-gray-400 hover:text-red-600"
            title="Delete chat"
          />
        </div>
      )}
    </div>
  );
};

// ActionButton Component
const ActionButton = ({ onClick, icon: Icon, className = "", title }) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded-md transition-colors hover:bg-white ${className}`}
    title={title}
  >
    <Icon size={14} />
  </button>
);

export default ChatSidebar;
