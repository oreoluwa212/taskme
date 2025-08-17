// src/components/chat/ChatMessage.jsx
import React from "react";
import { User, Bot } from "lucide-react";

const ChatMessage = ({
  message,
  formatTime,
  isMobile,
  userAvatar,
  userName,
}) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] ${
          isUser ? "order-2" : "order-1"
        }`}
      >
        {/* Avatar and timestamp */}
        <div
          className={`flex items-center space-x-2 mb-2 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`flex items-center space-x-2 ${
              isUser ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <MessageAvatar
              sender={message.sender}
              isMobile={isMobile}
              userAvatar={userAvatar}
              userName={userName}
            />
            <span className="text-xs text-gray-500">
              {formatTime(message.createdAt)}
            </span>
          </div>
        </div>

        {/* Message content */}
        <div
          className={`rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-900 border"
          }`}
        >
          <div className="whitespace-pre-wrap break-words text-sm md:text-base">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

// MessageAvatar Component
const MessageAvatar = ({ sender, isMobile, userAvatar, userName }) => {
  const isUser = sender === "user";
  const size = isMobile ? 12 : 16;
  const avatarSize = isMobile ? "w-6 h-6" : "w-8 h-8";

  if (isUser) {
    // User Avatar - prioritize actual avatar image
    if (userAvatar) {
      return (
        <div
          className={`${avatarSize} rounded-full overflow-hidden border-2 border-blue-200 flex-shrink-0`}
        >
          <img
            src={userAvatar}
            alt={userName || "User"}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div
            className={`${avatarSize} bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold`}
            style={{ display: "none" }}
          >
            {getInitials(userName)}
          </div>
        </div>
      );
    } else if (userName) {
      // Fallback to user initials if no avatar
      return (
        <div
          className={`${avatarSize} bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0`}
        >
          {getInitials(userName)}
        </div>
      );
    } else {
      // Final fallback to User icon
      return (
        <div
          className={`${avatarSize} bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0`}
        >
          <User size={size} />
        </div>
      );
    }
  } else {
    // AI Assistant Avatar
    return (
      <div
        className={`${avatarSize} bg-gray-200 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0`}
      >
        <Bot size={size} />
      </div>
    );
  }
};

// Helper function to get user initials
const getInitials = (name) => {
  if (!name) return "U";

  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// TypingIndicator Component
export const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-gray-100 rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 border">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {[0, 0.1, 0.2].map((delay, index) => (
            <div
              key={index}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">AI is thinking...</span>
      </div>
    </div>
  </div>
);

// EmptyMessagesState Component
export const EmptyMessagesState = ({ isMobile }) => (
  <div className="text-center text-gray-500 py-8 md:py-12">
    <Bot size={isMobile ? 40 : 48} className="mx-auto text-gray-300 mb-4" />
    <p className="text-base md:text-lg">No messages yet</p>
    <p className="text-sm">Start the conversation below!</p>
  </div>
);

export default ChatMessage;
