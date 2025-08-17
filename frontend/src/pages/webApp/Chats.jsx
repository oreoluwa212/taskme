import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { useChatStore } from "../../store/chatStore";
import { toast } from "react-toastify";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ChatSidebar from "../../components/chats/ChatSidebar";
import ChatInterface from "../../components/chats/ChatInterface";
import EmptyState from "../../components/chats/EmptyState";
import NewChatModal from "../../components/chats/NewChatModal";
import ProjectCreationModal from "../../components/chats/ProjectCreationModal";
import ChatSuggestions from "../../components/chats/ChatSuggestions";

const Chats = () => {
  const navigate = useNavigate();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [newChatTitle, setNewChatTitle] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    chats,
    currentChat,
    messages,
    loading,
    sending,
    error,
    user,
    fetchChats,
    createChat,
    fetchChat,
    sendMessage,
    updateChatTitle,
    deleteChat,
    createProjectFromChat,
    clearError,
  } = useChatStore();

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(false);
      if (!selectedChatId && chats.length > 0) {
        handleSelectChat(chats[0]);
      }
    }
  }, [isMobile, chats, selectedChatId]);

  const handleSelectChat = useCallback(
    async (chat) => {
      if (selectedChatId === chat._id && currentChat?._id === chat._id) {
        return;
      }

      setSelectedChatId(chat._id);

      if (isMobile) {
        setSidebarOpen(false);
      }

      try {
        await fetchChat(chat._id);
      } catch (error) {
        console.error("Error fetching chat:", error);
        toast.error("Failed to load chat");
      }
    },
    [fetchChat, selectedChatId, currentChat, isMobile]
  );

  const handleSendMessage = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!messageInput.trim() || !selectedChatId || sending) return;

      const message = messageInput.trim();
      setMessageInput("");

      try {
        await sendMessage(selectedChatId, message);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessageInput(message);
        toast.error("Failed to send message");
      }
    },
    [messageInput, selectedChatId, sending, sendMessage]
  );

  const handleCreateChat = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!newChatTitle.trim()) return;

      try {
        const newChat = await createChat({ title: newChatTitle });
        setSelectedChatId(newChat._id);
        setNewChatTitle("");
        setShowNewChatModal(false);

        if (isMobile) {
          setSidebarOpen(false);
        }

        toast.success("Chat created successfully!");
      } catch (error) {
        console.error("Error creating chat:", error);
        toast.error("Failed to create chat");
      }
    },
    [newChatTitle, createChat, isMobile]
  );

  // NEW: Handle chat created from suggestions
  const handleChatCreatedFromSuggestion = useCallback(
    async (newChat) => {
      try {
        // Update the selected chat
        setSelectedChatId(newChat._id);

        // Close sidebar on mobile
        if (isMobile) {
          setSidebarOpen(false);
        }

        // Fetch the complete chat data to ensure we have all messages
        await fetchChat(newChat._id);

        console.log(
          "Successfully switched to new chat from suggestion:",
          newChat
        );
      } catch (error) {
        console.error("Error switching to new chat:", error);
        toast.error("Chat created but failed to load");
      }
    },
    [fetchChat, isMobile]
  );

  const handleEditTitle = useCallback(
    async (chatId, title) => {
      if (!title.trim()) return;

      try {
        await updateChatTitle(chatId, title);
        toast.success("Chat title updated!");
      } catch (error) {
        console.error("Error updating title:", error);
        toast.error("Failed to update title");
      }
    },
    [updateChatTitle]
  );

  const handleDeleteChat = useCallback(
    async (chatId) => {
      if (!window.confirm("Are you sure you want to delete this chat?")) {
        return;
      }

      try {
        await deleteChat(chatId);
        if (selectedChatId === chatId) {
          const remainingChats = chats.filter((chat) => chat._id !== chatId);
          if (remainingChats.length > 0) {
            setSelectedChatId(remainingChats[0]._id);
            await fetchChat(remainingChats[0]._id);
          } else {
            setSelectedChatId(null);
          }
        }
        toast.success("Chat deleted successfully!");
      } catch (error) {
        console.error("Error deleting chat:", error);
        toast.error("Failed to delete chat");
      }
    },
    [deleteChat, selectedChatId, chats, fetchChat]
  );

  const handleCreateProject = useCallback(
    async (chatId) => {
      if (!messages || messages.length < 2) {
        toast.warning(
          "Please have a more detailed conversation before creating a project."
        );
        return;
      }

      const totalContent = messages.reduce(
        (acc, msg) => acc + (msg.content?.length || 0),
        0
      );
      if (totalContent < 100) {
        toast.warning(
          "The conversation is too brief to create a project. Please provide more details."
        );
        return;
      }

      setCreatingProject(true);

      try {
        const result = await createProjectFromChat(chatId);

        toast.success("Project created successfully!");
        console.log("Created project:", result);

        // Navigate to project details page
        if (result.data?.project?._id) {
          navigate(`/project/${result.data.project._id}/details`);

          // Close sidebar on mobile after navigation
          if (isMobile) {
            setSidebarOpen(false);
          }
        } else if (result.project?._id) {
          // Handle different response structure if needed
          navigate(`/project/${result.project._id}/details`);

          if (isMobile) {
            setSidebarOpen(false);
          }
        }
      } catch (error) {
        console.error("Error creating project:", error);

        if (error.message.includes("extract project information")) {
          toast.error(
            "Unable to create project from this conversation. Try discussing a specific project idea in more detail."
          );
        } else if (error.message.includes("400")) {
          toast.error(
            "Please provide more specific project details in your chat."
          );
        } else {
          toast.error("Failed to create project. Please try again.");
        }
      } finally {
        setCreatingProject(false);
      }
    },
    [createProjectFromChat, messages, navigate, isMobile] // Add navigate and isMobile to dependencies
  );
  const formatMessageTime = useCallback((timestamp) => {
    try {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  }, [isMobile, sidebarOpen, sidebarCollapsed]);

  const openNewChatModal = useCallback(() => {
    setShowNewChatModal(true);
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const closeNewChatModal = useCallback(() => {
    setShowNewChatModal(false);
    setNewChatTitle("");
  }, []);

  const renderSidebar = () => {
    if (isMobile) {
      return (
        <>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div
            className={`fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 lg:hidden ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <ChatSidebar
              chats={chats}
              loading={loading}
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
              onCreateChat={openNewChatModal}
              onEditTitle={handleEditTitle}
              onDeleteChat={handleDeleteChat}
              onCreateProject={handleCreateProject}
              isCollapsed={false}
              isMobile={true}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </>
      );
    }

    return (
      <ChatSidebar
        chats={chats}
        loading={loading}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onCreateChat={openNewChatModal}
        onEditTitle={handleEditTitle}
        onDeleteChat={handleDeleteChat}
        onCreateProject={handleCreateProject}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
    );
  };

  const shouldShowEmptyState = () => {
    if (isMobile) {
      return chats.length === 0 || !selectedChatId;
    }
    return !selectedChatId || !currentChat;
  };

  // Get user avatar and name from user object
  const userAvatar =
    user?.avatar?.url || user?.profilePicture || user?.profileImage;
  const userName =
    user?.name || user?.username || user?.firstname || user?.firstName
      ? `${user?.firstname || user?.firstName} ${
          user?.lastname || user?.lastName || ""
        }`.trim()
      : user?.email?.split("@")[0] || null;

  return (
    <div className="h-[90vh] flex bg-white overflow-hidden">
      {renderSidebar()}

      <div className="flex-1 flex flex-col h-[90vh] overflow-hidden">
        {shouldShowEmptyState() ? (
          <EmptyState
            onCreateChat={openNewChatModal}
            isMobile={isMobile}
            onToggleSidebar={isMobile ? toggleSidebar : undefined}
            hasChats={chats.length > 0}
            chatCount={chats.length}
          />
        ) : (
          <ChatInterface
            currentChat={currentChat}
            messages={messages}
            sending={sending}
            messageInput={messageInput}
            onMessageInputChange={setMessageInput}
            onSendMessage={handleSendMessage}
            onCreateProject={handleCreateProject}
            onToggleSidebar={toggleSidebar}
            formatTime={formatMessageTime}
            isMobile={isMobile}
            error={error}
            clearError={clearError}
            userAvatar={userAvatar}
            userName={userName}
          />
        )}
      </div>

      <NewChatModal
        isOpen={showNewChatModal}
        onClose={closeNewChatModal}
        title={newChatTitle}
        onTitleChange={setNewChatTitle}
        onSubmit={handleCreateChat}
      />

      <ProjectCreationModal
        isOpen={creatingProject}
        chatTitle={currentChat?.title}
      />
    </div>
  );
};

export default Chats;
