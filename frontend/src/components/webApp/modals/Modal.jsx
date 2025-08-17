import React, { useState } from "react";
import FormInput from "../input/FormInput";
import CustomBtn from "../buttons/CustomBtn";

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      onSubmit(currentPassword, newPassword);
    } else {
      alert("Passwords do not match");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded p-8 shadow-lg relative lgss:w-[25%]">
        <div className="py-6">
          <button
            className="absolute top-2 right-3 text-4xl text-gray-600"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold">Update Password</h2>
          <p className="text-sm">Update your password by creating a new one.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            name="currentPassword"
            id="currentPassword"
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <FormInput
            name="newPassword"
            id="newPassword"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <FormInput
            name="confirmPassword"
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <CustomBtn title="Update Password" />
        </form>
      </div>
    </div>
  );
};

export default Modal;
