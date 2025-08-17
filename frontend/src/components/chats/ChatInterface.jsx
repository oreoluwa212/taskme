import React, { useRef, useEffect } from "react";
import { Menu, FolderPlus, MessageSquare, Send } from "lucide-react";
import ChatMessage, {
  TypingIndicator,
  EmptyMessagesState,
} from "./ChatMessage";
import Button from "../ui/Button";

const ChatInterface = ({
  currentChat,
  messages,
  sending,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  onCreateProject,
  onToggleSidebar,
  formatTime,
  isMobile,
  error,
  clearError,
  userAvatar,
  userName,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const canCreateProject = currentChat && messages && messages.length >= 2;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed Chat Header - Mobile */}
      {isMobile && (
        <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={onToggleSidebar}
                variant="ghost"
                size="sm"
                className="p-2 text-gray-600 hover:bg-gray-100"
                title="Open chat sidebar"
              >
                <Menu size={20} />
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {currentChat?.title || "Chat"}
                </h2>
              </div>
            </div>

            <div className="flex items-center">
              {canCreateProject ? (
                <Button
                  onClick={() => onCreateProject(currentChat._id)}
                  variant="ghost"
                  size="sm"
                  className="p-2 text-green-600 hover:bg-green-50"
                  title="Create project from this conversation"
                >
                  <FolderPlus size={16} />
                </Button>
              ) : (
                <Button
                  disabled
                  variant="ghost"
                  size="sm"
                  className="p-2 text-gray-400 cursor-not-allowed"
                  title="Have a more detailed conversation to create a project"
                >
                  <FolderPlus size={16} />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Chat Header - Desktop */}
      {!isMobile && (
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {currentChat?.title || "Chat"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                AI Assistant • Always ready to help
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {canCreateProject ? (
                <Button
                  onClick={() => onCreateProject(currentChat._id)}
                  variant="success"
                  size="sm"
                  className="px-4 py-2 flex items-center space-x-2"
                  title="Create project from this conversation"
                >
                  <FolderPlus size={16} />
                  <span>Create Project</span>
                </Button>
              ) : (
                <Button
                  disabled
                  variant="ghost"
                  size="sm"
                  className="px-4 py-2 bg-gray-400 text-white cursor-not-allowed flex items-center space-x-2"
                  title="Have a more detailed conversation to create a project"
                >
                  <FolderPlus size={16} />
                  <span>Create Project</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Messages Container */}
      <div className="flex-1 overflow-y-auto h-[90vh] px-4 md:px-6 py-4">
        <div className="space-y-4 md:space-y-6">
          {!messages || messages.length === 0 ? (
            <EmptyMessagesState isMobile={isMobile} />
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={message._id || index}
                  message={message}
                  formatTime={formatTime}
                  isMobile={isMobile}
                  userAvatar={userAvatar}
                  userName={userName}
                />
              ))}
              {sending && <TypingIndicator />}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Message Input */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 md:p-6">
        <form onSubmit={onSendMessage} className="relative">
          <div className="relative flex items-center">
            <MessageSquare
              className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
              size={isMobile ? 18 : 20}
            />
            <input
              type="text"
              value={messageInput}
              onChange={(e) => {
                onMessageInputChange(e.target.value);
                if (error) clearError();
              }}
              placeholder="Message AI Assistant..."
              className="w-full pl-10 md:pl-12 pr-12 md:pr-16 py-3 md:py-4 
                border border-gray-300 rounded-xl md:rounded-2xl focus:outline-none 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                bg-white shadow-sm text-sm md:text-base resize-none"
              disabled={sending || !!error}
            />
            <Button
              type="submit"
              disabled={!messageInput.trim() || sending || !!error}
              variant="primary"
              size="sm"
              className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 
                p-2 rounded-lg md:rounded-xl z-10"
            >
              <Send size={16} />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • AI can make mistakes, verify important
            information
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
