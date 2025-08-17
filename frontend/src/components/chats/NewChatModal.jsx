// Updated NewChatModal.jsx
import React from "react";
import { Plus } from "lucide-react";
import Button from "../ui/Button";
import { useModal } from "../../hooks/useModal"; // Import the hook

const NewChatModal = ({
  isOpen,
  onClose,
  title,
  onTitleChange,
  onSubmit,
  loading = false,
}) => {
  // Use the modal hook to handle body scroll lock
  useModal(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="modal-container">
        <div className="modal-content bg-white w-full max-w-md">
          <div className="p-4 md:p-6">
            <ModalHeader />
            <ModalForm
              title={title}
              onTitleChange={onTitleChange}
              onSubmit={handleSubmit}
              onClose={onClose}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ModalHeader Component
const ModalHeader = () => (
  <div className="flex items-center space-x-3 mb-6">
    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      <Plus size={20} className="text-blue-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900">Create New Chat</h3>
  </div>
);

// ModalForm Component
const ModalForm = ({ title, onTitleChange, onSubmit, onClose, loading }) => (
  <form onSubmit={onSubmit}>
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Chat Title
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Enter a descriptive title for your chat"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
        disabled={loading}
      />
    </div>

    <div className="flex justify-end space-x-3">
      <Button
        type="button"
        onClick={onClose}
        variant="ghost"
        disabled={loading}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={!title.trim()}
        loading={loading}
        variant="primary"
      >
        Create Chat
      </Button>
    </div>
  </form>
);

export default NewChatModal;
